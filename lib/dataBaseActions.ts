'use server';

import { type Session } from 'next-auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

import { auth } from '@/lib/auth';
import { sql } from '@/lib/postgres';
import { siteConfig } from '@/config/site';

export async function incrementViews(slug: string) {
  noStore();

  let session = await auth();

  if (session && session.user && siteConfig.siteAdmins.includes(session.user?.email as string)) {
    return;
  }
  
  await sql`
    INSERT INTO views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = views.count + 1
  `;
}

async function getSession(): Promise<Session> {
  let session = await auth();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function saveGuestbookEntry(formData: FormData) {  
  const entry = formData.get('entry')?.toString() || String('');
  const body = entry.slice(0, 1000);

  const random = Math.floor(Math.random() * 1000000);

  const session = await auth();

  if (!session || !session.user) {
    const email = formData.get('code')?.toString() || String('');
    
    if (!siteConfig.codes.includes(email)) {
      throw new Error('Unauthorized');
    }

    const created_by = formData.get('name')?.toString() || String('');

    await sql`
      INSERT INTO guestbook (id, email, body, created_by, created_at)
      VALUES (${random}, ${email}, ${body}, ${created_by}, NOW())
    `;
  } else {
    let email = formData.get('code')?.toString() || String('');
    
    if (siteConfig.codes.includes(email)) {
      const created_by = formData.get('name')?.toString() || String('');
      
      await sql`
        INSERT INTO guestbook (id, email, body, created_by, created_at)
        VALUES (${random}, ${email}, ${body}, ${created_by}, NOW())
      `;
    } else {
      email = session.user?.email as string;
      const created_by = session.user?.name as string;
      
      await sql`
        INSERT INTO guestbook (id, email, body, created_by, created_at)
        VALUES (${random}, ${email}, ${body}, ${created_by}, NOW())
      `;
    }
  }

  revalidatePath('/guestbook');
}

export async function deleteGuestbookEntries(selectedEntries: string[]) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (!siteConfig.siteAdmins.includes(email)) {
    throw new Error('Unauthorized');
  }

  let selectedEntriesAsNumbers = selectedEntries.map(Number);
  let arrayLiteral = `{${selectedEntriesAsNumbers.join(',')}}`;

  await sql`
    DELETE FROM guestbook
    WHERE id = ANY(${arrayLiteral}::int[])
  `;

  revalidatePath('/guestbook/admin');
  revalidatePath('/guestbook');
}