export type MuritCategory = {
  name: string;
  slug: string;
};

export type MuritTag = {
  name: string;
  slug: string;
};

export type MuritMedia = {
  url: string;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MuritSeo = {
  title?: string | null;
  description?: string | null;
  socialImage?: {
    url?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  canonicalURL?: string | null;
  keywords?: string | null;
};

export type MuritPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt: string;
  modifiedAt?: string | null;
  featuredMedia?: MuritMedia | null;
  categories?: MuritCategory[] | null;
  tags?: MuritTag[] | null;
  seo?: MuritSeo | null;
};

export type MuritPostDetail = MuritPostSummary & {
  contentHtml: string;
};

export type MuritPostsResponse = {
  data: MuritPostSummary[];
  meta?: {
    limit: number;
    nextCursor?: string | null;
  };
};

export type MuritSinglePostResponse = {
  data: MuritPostDetail;
};

export const CMS_BASE_URL = (
  process.env.CMS_BASE_URL ||
  process.env.NEXT_PUBLIC_CMS_BASE_URL ||
  'https://murit.space'
).replace(/\/+$/, '');

export const CMS_SITE_KEY =
  process.env.CMS_SITE_KEY ||
  process.env.NEXT_PUBLIC_CMS_SITE_KEY ||
  '';

/**
 * Checks whether Murit CMS is configured with a valid site key.
 */
export function isMuritConfigured(): boolean {
  return Boolean(CMS_SITE_KEY && CMS_SITE_KEY.trim().length > 0);
}

/**
 * Fetch a list of published posts from Murit CMS.
 * Uses Next.js incremental cache revalidation (60s).
 */
export async function getPosts(options?: {
  limit?: number;
  category?: string;
  tag?: string;
}): Promise<MuritPostSummary[]> {
  if (!isMuritConfigured()) {
    return [];
  }

  const query = new URLSearchParams();
  query.set('limit', String(options?.limit ?? 12));
  if (options?.category) query.set('category', options.category);
  if (options?.tag) query.set('tag', options.tag);

  const endpoint = `${CMS_BASE_URL}/api/content/v1/sites/${CMS_SITE_KEY}/posts?${query.toString()}`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      console.warn(`[Murit CMS] Failed to fetch posts (${res.status} ${res.statusText})`);
      return [];
    }

    const json = (await res.json()) as MuritPostsResponse;
    return json?.data ?? [];
  } catch (error) {
    console.warn('[Murit CMS] Network error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch a single post by its slug.
 * Uses Next.js incremental cache revalidation (60s).
 */
export async function getPostBySlug(slug: string): Promise<MuritPostDetail | null> {
  if (!isMuritConfigured() || !slug) {
    return null;
  }

  const endpoint = `${CMS_BASE_URL}/api/content/v1/sites/${CMS_SITE_KEY}/posts/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.warn(`[Murit CMS] Failed to fetch post ${slug} (${res.status} ${res.statusText})`);
      return null;
    }

    const json = (await res.json()) as MuritSinglePostResponse;
    return json?.data ?? null;
  } catch (error) {
    console.warn(`[Murit CMS] Network error fetching post ${slug}:`, error);
    return null;
  }
}
