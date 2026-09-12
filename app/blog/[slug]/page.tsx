import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter, SiteHeader } from '../../SiteChrome';
import { getPostBySlug } from '../muritClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt || '';
  const imageUrl = post.seo?.socialImage?.url || post.featuredMedia?.url;
  const keywordsList = post.seo?.keywords
    ? post.seo.keywords.split(',').map((k) => k.trim())
    : post.tags?.map((t) => t.name) || [];

  return {
    title,
    description,
    keywords: keywordsList,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt || undefined,
      authors: post.author ? [post.author] : ['EPFO Digital Desk'],
      tags: post.tags?.map((t) => t.name) || [],
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: post.seo?.socialImage?.alt || post.featuredMedia?.alt || post.title,
              width: post.seo?.socialImage?.width || post.featuredMedia?.width || 1200,
              height: post.seo?.socialImage?.height || post.featuredMedia?.height || 630,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: post.seo?.canonicalURL || undefined,
    },
  };
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const primaryCategory = post.categories?.[0]?.name;
  const formattedDate = formatDate(post.publishedAt);
  const formattedModifiedDate = post.modifiedAt ? formatDate(post.modifiedAt) : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo?.description || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt || post.publishedAt,
    mainEntityOfPage: post.seo?.canonicalURL || undefined,
    image: post.featuredMedia?.url || undefined,
    author: {
      '@type': 'Organization',
      name: post.author || 'Employees’ Provident Fund Organisation',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EPFO Services Portal',
    },
    keywords: post.seo?.keywords || undefined,
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="interior-main">
        <section className="interior-hero">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">Blog & Updates</Link>
            <span aria-hidden="true">/</span>
            <span style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post.title}
            </span>
          </nav>

          {primaryCategory && (
            <p className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {primaryCategory}
            </p>
          )}

          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.25, fontWeight: 800, color: 'var(--ink, #4b312d)' }}>
            {post.title}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              marginTop: '1.25rem',
              fontSize: '0.9375rem',
              color: 'var(--muted, #71635f)',
            }}
          >
            {post.author && (
              <span>
                By <strong style={{ color: 'var(--ink, #4b312d)' }}>{post.author}</strong>
              </span>
            )}
            <span>
              Published on <strong style={{ color: 'var(--ink, #4b312d)' }}>{formattedDate}</strong>
            </span>
            {formattedModifiedDate && formattedModifiedDate !== formattedDate && (
              <span>
                (Updated: <em>{formattedModifiedDate}</em>)
              </span>
            )}
            {post.readingTime && (
              <span
                style={{
                  backgroundColor: 'var(--cream, #f4eadf)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: 'var(--orange-dark, #b84e11)',
                }}
              >
                {post.readingTime}
              </span>
            )}
          </div>
        </section>

        <div
          className="interior-layout"
          style={{
            display: 'block',
            maxWidth: '860px',
            margin: '0 auto',
            padding: '2rem 1.5rem 5rem',
          }}
        >
          {/* SEO Metadata & Transparency Snippet Box */}
          {post.seo && (
            <div
              style={{
                backgroundColor: 'var(--paper, #fffaf4)',
                border: '1px solid var(--line, #ded7cc)',
                borderRadius: '0.85rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '2.5rem',
                boxShadow: '0 2px 10px rgba(75, 49, 45, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--orange-dark, #b84e11)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span aria-hidden="true">&#9672;</span> SEO &amp; Search Engine Snippet
                </span>
                {post.seo.focusedKeyword && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--cream, #f4eadf)',
                      color: 'var(--ink, #4b312d)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                    }}
                  >
                    Target Keyword: <strong>{post.seo.focusedKeyword}</strong>
                  </span>
                )}
              </div>

              {post.seo.description && (
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: 'var(--muted, #71635f)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  <strong>Meta Description:</strong> {post.seo.description}
                </p>
              )}

              {post.seo.canonicalURL && (
                <div style={{ fontSize: '0.8rem', color: 'var(--muted, #71635f)' }}>
                  <strong>Canonical URL:</strong>{' '}
                  <code style={{ fontSize: '0.78rem', backgroundColor: 'var(--cream, #f4eadf)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                    {post.seo.canonicalURL}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Featured Hero Media with Accessibility Alt Tag */}
          {post.featuredMedia?.url && (
            <div
              style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                backgroundColor: 'var(--cream, #f4eadf)',
                marginBottom: '2.5rem',
                boxShadow: '0 8px 24px rgba(75, 49, 45, 0.08)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredMedia.url}
                alt={post.featuredMedia.alt || post.title}
                width={post.featuredMedia.width || 1200}
                height={post.featuredMedia.height || 630}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '480px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {post.featuredMedia.caption && (
                <p
                  style={{
                    padding: '0.75rem 1.25rem',
                    margin: 0,
                    fontSize: '0.8125rem',
                    color: 'var(--muted, #71635f)',
                    fontStyle: 'italic',
                    borderTop: '1px solid var(--line, #ded7cc)',
                    backgroundColor: 'var(--paper, #fffaf4)',
                  }}
                >
                  <strong>Figure 1.1:</strong> {post.featuredMedia.caption}
                </p>
              )}
            </div>
          )}

          {/* Article HTML sanitized server-side by Murit CMS */}
          <article
            className="murit-article-content"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.85,
              color: 'var(--ink, #4b312d)',
            }}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Tags cloud */}
          {post.tags && post.tags.length > 0 && (
            <div
              style={{
                marginTop: '3.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--line, #ded7cc)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted, #71635f)' }}>Topics &amp; Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag.slug || tag.name}
                  style={{
                    backgroundColor: 'var(--cream, #f4eadf)',
                    color: 'var(--ink, #4b312d)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                  }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Card with Back Button */}
          <div
            style={{
              marginTop: '3rem',
              padding: '1.5rem',
              backgroundColor: 'var(--paper, #fffaf4)',
              border: '1px solid var(--line, #ded7cc)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--ink, #4b312d)' }}>
                EPFO Digital Communications
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--muted, #71635f)' }}>
                Verified educational content. Powered by Murit Headless CMS.
              </p>
            </div>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.65rem 1.35rem',
                backgroundColor: 'var(--orange-dark, #b84e11)',
                color: '#ffffff',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              &larr; Back to all articles
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}
