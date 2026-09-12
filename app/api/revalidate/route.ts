import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Murit CMS Webhook Handler for Instant On-Demand Revalidation.
 *
 * When an article is published, updated, or unpublished in Murit CMS,
 * Murit sends an HTTP POST webhook. This route purges the Next.js cache
 * for /blog and /blog/[slug], making new content immediately visible
 * with zero full-site rebuilds.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-murit-secret');
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
  }

  try {
    const payload = (await req.json().catch(() => ({}))) as {
      event?: string;
      doc?: {
        slug?: string;
      };
      slug?: string;
    };

    const targetSlug = payload?.doc?.slug || payload?.slug;

    if (targetSlug) {
      revalidatePath(`/blog/${targetSlug}`);
    }

    revalidatePath('/blog');

    return NextResponse.json({
      revalidated: true,
      slug: targetSlug ?? null,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error processing revalidation webhook', error: String(error) },
      { status: 500 }
    );
  }
}
