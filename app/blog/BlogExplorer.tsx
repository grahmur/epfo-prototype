'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { MuritPostSummary } from './muritClient';

type Props = {
  posts: MuritPostSummary[];
};

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function BlogExplorer({ posts }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Close drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => {
      post.categories?.forEach((cat) => {
        if (cat.name) set.add(cat.name);
      });
    });
    return Array.from(set);
  }, [posts]);

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory ||
        post.categories?.some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div style={{ position: 'relative' }}>
      {/* Top Toolbar with Category Pills and Drawer Trigger */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--line, #ded7cc)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: selectedCategory === null ? 'var(--orange-dark, #b84e11)' : 'var(--line, #ded7cc)',
              backgroundColor: selectedCategory === null ? 'var(--orange-dark, #b84e11)' : 'var(--paper, #fffaf4)',
              color: selectedCategory === null ? '#ffffff' : 'var(--ink, #4b312d)',
              transition: 'all 0.15s ease',
            }}
          >
            All Categories ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--orange-dark, #b84e11)' : 'var(--line, #ded7cc)',
                backgroundColor: selectedCategory === cat ? 'var(--orange-dark, #b84e11)' : 'var(--paper, #fffaf4)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--ink, #4b312d)',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Button to Open Quick Directory Drawer */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.15rem',
            borderRadius: '0.65rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: 'var(--cream, #f4eadf)',
            color: 'var(--ink, #4b312d)',
            border: '1px solid var(--line, #ded7cc)',
            boxShadow: '0 2px 6px rgba(75, 49, 45, 0.05)',
            transition: 'background-color 0.15s ease',
          }}
          aria-label="Open article quick drawer"
        >
          <span aria-hidden="true" style={{ fontSize: '1.1rem' }}>☰</span>
          <span>Browse All in Drawer ({posts.length})</span>
        </button>
      </div>

      {/* Main Grid of Articles */}
      {displayedPosts.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {displayedPosts.map((post) => {
            const category = post.categories?.[0]?.name;
            const formattedDate = formatDate(post.publishedAt);

            return (
              <article
                key={post.slug || post.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--paper, #fffaf4)',
                  border: '1px solid var(--line, #ded7cc)',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(75, 49, 45, 0.05)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {post.featuredMedia?.url && (
                  <div
                    style={{
                      width: '100%',
                      height: '190px',
                      backgroundColor: 'var(--cream, #f4eadf)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featuredMedia.url}
                      alt={post.featuredMedia.alt || post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.8125rem',
                      color: 'var(--muted, #71635f)',
                    }}
                  >
                    {category ? (
                      <span
                        style={{
                          backgroundColor: 'var(--cream, #f4eadf)',
                          color: 'var(--orange-dark, #b84e11)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {category}
                      </span>
                    ) : (
                      <span />
                    )}
                    <time dateTime={post.publishedAt}>{formattedDate}</time>
                  </div>

                  <h2
                    style={{
                      fontSize: '1.25rem',
                      lineHeight: 1.35,
                      fontWeight: 700,
                      color: 'var(--ink, #4b312d)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {post.excerpt && (
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.5,
                        color: 'var(--muted, #71635f)',
                        marginBottom: '1.25rem',
                        flexGrow: 1,
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--orange-dark, #b84e11)',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        textDecoration: 'none',
                      }}
                    >
                      <span>Read article</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--paper, #fffaf4)',
            borderRadius: '1rem',
            border: '1px solid var(--line, #ded7cc)',
          }}
        >
          <p style={{ fontSize: '1.1rem', color: 'var(--muted, #71635f)', margin: 0 }}>
            No articles found matching &quot;{searchQuery}&quot;.
          </p>
        </div>
      )}

      {/* View More Button */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2.2rem',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--orange-dark, #b84e11)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 12px rgba(184, 78, 17, 0.25)',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
          >
            <span>View More Articles</span>
            <span aria-hidden="true">&darr;</span>
          </button>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted, #71635f)', marginTop: '0.65rem' }}>
            Showing {displayedPosts.length} of {filteredPosts.length} articles
          </p>
        </div>
      )}

      {/* Slide-out Quick Drawer Modal */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Article quick directory drawer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {/* Backdrop Blur */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(75, 49, 45, 0.4)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer Content Panel */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              backgroundColor: 'var(--paper, #fffaf4)',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1001,
              animation: 'slideInRight 0.25s ease-out',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--line, #ded7cc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--cream, #f4eadf)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #4b312d)' }}>
                  All Articles & Guides
                </h3>
                <small style={{ color: 'var(--muted, #71635f)', fontSize: '0.8rem' }}>
                  {posts.length} articles available
                </small>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--line, #ded7cc)',
                  backgroundColor: 'var(--paper, #fffaf4)',
                  color: 'var(--ink, #4b312d)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close drawer"
              >
                &times;
              </button>
            </div>

            {/* Drawer Search Box */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--line, #ded7cc)' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by keyword..."
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--line, #ded7cc)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.9rem',
                  color: 'var(--ink, #4b312d)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Drawer Scrollable Article List */}
            <div
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '1rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug || post.id}
                  href={`/blog/${post.slug}`}
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    display: 'block',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--line, #ded7cc)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.15s ease, transform 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    {post.categories?.[0]?.name && (
                      <span
                        style={{
                          backgroundColor: 'var(--cream, #f4eadf)',
                          color: 'var(--orange-dark, #b84e11)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {post.categories[0].name}
                      </span>
                    )}
                    <small style={{ color: 'var(--muted, #71635f)', fontSize: '0.75rem' }}>
                      {formatDate(post.publishedAt)}
                    </small>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink, #4b312d)', lineHeight: 1.35 }}>
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p
                      style={{
                        margin: '0.35rem 0 0 0',
                        fontSize: '0.8125rem',
                        color: 'var(--muted, #71635f)',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--line, #ded7cc)',
                backgroundColor: 'var(--cream, #f4eadf)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <small style={{ color: 'var(--muted, #71635f)' }}>
                Powered by Murit CMS
              </small>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--line, #ded7cc)',
                  backgroundColor: '#ffffff',
                  color: 'var(--ink, #4b312d)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
