'use server';

import {
  unstable_noStore as noStore,
} from 'next/cache';

import { sql } from '@/lib/postgres';
import { entryMeta } from '@/config/site';


export async function getBlogViews() {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  noStore();
  let views = await sql`
    SELECT count
    FROM views
  `;

  return views.reduce((acc, curr) => acc + Number(curr.count), 0);
}

export async function getViewsCount(): Promise<
  { slug: string; count: number }[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  noStore();
  return sql`
    SELECT slug, count
    FROM views
  `;
}

export async function getGuestbookEntries(): Promise<
  entryMeta[]
> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }

  noStore();
  return sql`
    SELECT id, body, created_by, created_at, updated_at, email
    FROM guestbook
    ORDER BY created_at DESC
    LIMIT 300
  `;
}