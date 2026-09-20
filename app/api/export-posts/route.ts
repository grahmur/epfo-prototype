import { NextResponse } from 'next/server';
import { SAMPLE_POSTS } from '../../blog/muritClient';

/**
 * Migration & Export Endpoint for Murit CMS.
 *
 * Serves all local/pre-existing EPFO blog posts in the exact schema
 * expected by Murit CMS's automated Legacy Blog Migration engine
 * (POST /api/workspace/migrate or Admin Console > Legacy Blog Migration).
 */
export async function GET() {
  const formattedPosts = SAMPLE_POSTS.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    date: post.publishedAt,
    publishedAt: post.publishedAt,
    updatedAt: post.modifiedAt || post.publishedAt,
    lastUpdatedAt: post.modifiedAt || post.publishedAt,
    author: post.author || 'EPFO Editorial Desk',
    excerpt: post.excerpt,
    image: post.featuredMedia?.url || null,
    imageAlt: post.featuredMedia?.alt || post.title,
    imageWidth: post.featuredMedia?.width || 1200,
    imageHeight: post.featuredMedia?.height || 630,
    featuredMedia: post.featuredMedia,
    categories: post.categories?.map((c) => c.name) || [],
    tags: post.tags?.map((t) => t.name) || [],
    seoTitle: post.seo?.title || post.title,
    seoDescription: post.seo?.description || post.excerpt,
    seoKeywords: post.seo?.keywords || post.seo?.focusedKeyword || '',
    seoImage: post.seo?.socialImage?.url || post.featuredMedia?.url || null,
    canonicalURL: post.seo?.canonicalURL || `https://epfo-prototype.vercel.app/blog/${post.slug}`,
    contentHtml: post.contentHtml.trim(),
    contentMarkdown: post.excerpt || '',
    redirectUrls: [`/blog/${post.slug}`],
  }));

  return NextResponse.json(
    {
      total: formattedPosts.length,
      posts: formattedPosts,
      data: formattedPosts,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
