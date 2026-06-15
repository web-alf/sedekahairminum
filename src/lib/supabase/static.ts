// Build-time anon client for prerendered marketing pages. No cookies, no
// session — just reads public (RLS-allowed) rows at build time. Kept separate
// from server.ts so build code never imports request/cookie machinery.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { publicEnv } from './env';

const { url, anonKey } = publicEnv();

export const supabaseStatic = createClient<Database>(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Fetch helper for build-time queries that should fail the build loudly rather
 * than silently render an empty page when RLS or config is wrong.
 */
export async function requireRows<T>(
  label: string,
  query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const { data, error } = await query;
  if (error) throw new Error(`[build] ${label}: ${error.message}`);
  if (!data || data.length === 0) {
    // Don't hard-fail — a fresh DB legitimately has no articles yet — but warn.
    console.warn(`[build] ${label}: returned 0 rows`);
    return [];
  }
  return data;
}
