import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../SiteChrome';
import { CMS_BASE_URL, CMS_SITE_KEY, getPosts, isMuritConfigured } from './muritClient';

export const metadata: Metadata = {
  title: 'Articles & Updates',
  description:
    'Official updates, educational guides, and notifications regarding provident fund, pensions, and digital services.',
};

export const revalidate = 60;

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

export default async function BlogIndexPage() {
  const configured = isMuritConfigured();
  const posts = await getPosts({ limit: 12 });

  return (
    <>
      <SiteHeader />
      <main id="main" className="interior-main">
        <section className="interior-hero">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Blog & Updates</span>
          </nav>
          <p className="eyebrow">Newsroom & Publications</p>
          <h1>Articles & Updates</h1>
          <p>
            Stay informed with the latest explainers, circular summaries, statutory updates, and digital service guides.
          </p>
        </section>

        <div className="interior-layout" style={{ display: 'block', maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          {posts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem',
                marginTop: '1.5rem',
              }}
            >
              {posts.map((post) => {
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
                          height: '180px',
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
                backgroundColor: 'var(--paper, #fffaf4)',
                border: '1px solid var(--line, #ded7cc)',
                borderRadius: '1.25rem',
                padding: '2.5rem',
                marginTop: '1.5rem',
                boxShadow: '0 8px 24px rgba(75, 49, 45, 0.04)',
              }}
            >
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '999px', backgroundColor: 'var(--cream, #f4eadf)', color: 'var(--orange-dark, #b84e11)', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Murit Headless CMS Connected
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink, #4b312d)', marginBottom: '0.75rem' }}>
                {configured ? 'No posts published yet' : 'Connect Your Murit CMS Site Key'}
              </h2>
              <p style={{ color: 'var(--muted, #71635f)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '720px', marginBottom: '1.5rem' }}>
                {configured
                  ? `Your website is connected to Murit CMS with site key "${CMS_SITE_KEY}". Once you publish articles in your Murit workspace, they will automatically appear here within 60 seconds with zero website rebuilds.`
                  : 'This blogging system is powered by Murit CMS (murit.space). To connect your live posts, configure two environment variables in your local environment or Vercel dashboard:'}
              </p>

              {!configured && (
                <div
                  style={{
                    backgroundColor: '#1f1b1a',
                    color: '#f6f3ef',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontFamily: 'Consolas, monospace',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                  }}
                >
                  <p style={{ margin: 0, color: '#9e918c' }}># Add to .env.local or Vercel Environment Variables:</p>
                  <p style={{ margin: '0.25rem 0 0 0' }}>CMS_BASE_URL=&quot;{CMS_BASE_URL}&quot;</p>
                  <p style={{ margin: '0.25rem 0 0 0' }}>CMS_SITE_KEY=&quot;site_your_registered_site_key&quot;</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="https://murit.space/admin"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--orange-dark, #b84e11)',
                    color: '#ffffff',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Open Murit Admin Console &rarr;
                </a>
                <a
                  href="https://murit.space/docs"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--cream, #f4eadf)',
                    color: 'var(--ink, #4b312d)',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  View Murit Docs &#8599;
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
