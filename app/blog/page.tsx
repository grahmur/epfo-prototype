import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../SiteChrome';
import BlogExplorer from './BlogExplorer';
import { getPosts } from './muritClient';

export const metadata: Metadata = {
  title: 'Articles & Updates',
  description:
    'Official updates, educational guides, circular explainers, and digital service notifications for employees, employers, and pensioners.',
};

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getPosts({ limit: 20 });

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
            Stay informed with the latest explainers, statutory circulars, operational guidelines, and digital service updates.
          </p>
        </section>

        <div className="interior-layout" style={{ display: 'block', maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          {/* Interactive Explorer with Category filters, Drawer, and View More button */}
          <BlogExplorer posts={posts} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
