// Shared, typed marketing-content queries used by the build-time static pages.
// One place owns the column selection + ordering so every page is consistent.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

type DB = SupabaseClient<Database>;

export async function getHeroSlides(client: DB) {
  const { data } = await client.from('hero_slides').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getStats(client: DB, grp: 'home' | 'penerima') {
  const { data } = await client.from('stats').select('*').eq('is_published', true).eq('grp', grp).order('sort_order');
  return data ?? [];
}
export async function getFeatures(client: DB) {
  const { data } = await client.from('features').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getProgramSlides(client: DB) {
  const { data } = await client.from('program_slides').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getGallery(client: DB) {
  const { data } = await client.from('gallery').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getTestimonials(client: DB) {
  const { data } = await client.from('testimonials').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getFaqs(client: DB) {
  const { data } = await client.from('faqs').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getPenerima(client: DB) {
  const { data } = await client.from('penerima').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getValues(client: DB) {
  const { data } = await client.from('values_list').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getTeam(client: DB) {
  const { data } = await client.from('team').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getMisi(client: DB) {
  const { data } = await client.from('misi').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}
export async function getRekening(client: DB) {
  const { data } = await client.from('rekening').select('*').eq('is_published', true).order('sort_order');
  return data ?? [];
}

export type SettingsMap = Record<string, Record<string, unknown>>;
export async function getSettings(client: DB): Promise<SettingsMap> {
  const { data } = await client.from('settings').select('key, value');
  const rows = (data ?? []) as Array<{ key: string; value: Record<string, unknown> | null }>;
  const map: SettingsMap = {};
  for (const row of rows) map[row.key] = row.value ?? {};
  return map;
}
