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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
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
            <span style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              marginTop: '1rem',
              fontSize: '0.9375rem',
              color: 'var(--muted, #71635f)',
            }}
          >
            <span>
              Published on <strong style={{ color: 'var(--ink, #4b312d)' }}>{formattedDate}</strong>
            </span>
            {formattedModifiedDate && formattedModifiedDate !== formattedDate && (
              <span>
                (Updated: <em>{formattedModifiedDate}</em>)
              </span>
            )}
          </div>
        </section>

        <div
          className="interior-layout"
          style={{
            display: 'block',
            maxWidth: '840px',
            margin: '0 auto',
            padding: '2rem 1.5rem 5rem',
          }}
        >
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
                    padding: '0.75rem 1rem',
                    margin: 0,
                    fontSize: '0.8125rem',
                    color: 'var(--muted, #71635f)',
                    fontStyle: 'italic',
                  }}
                >
                  {post.featuredMedia.caption}
                </p>
              )}
            </div>
          )}

          {/* Article HTML sanitized server-side by Murit CMS */}
          <article
            className="murit-article-content"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: 'var(--ink, #4b312d)',
            }}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

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
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted, #71635f)' }}>Tags:</span>
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
                Powered by Murit Headless CMS. Zero-rebuild instant updates.
              </p>
            </div>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 1.2rem',
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
    </>
  );
}
