// Hand-authored to match supabase/migrations/*. After applying migrations to
// your live project, regenerate the authoritative version with:
//   bunx supabase gen types typescript --linked > src/lib/supabase/types.ts
// (keep the helper aliases at the bottom of the file after regenerating).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamps = { created_at: string; updated_at: string };
type Publishable = { sort_order: number; is_published: boolean };

// Generic row/insert/update triple for marketing content tables.
type Row<T> = T & Timestamps & Publishable & { id: string };
type Ins<T> = Partial<Timestamps> & Partial<Publishable> & { id?: string } & T;
type Upd<T> = Partial<Row<T>>;

type TestimonialCols = { body: string; name: string; role: string; photo: string | null };
type FaqCols = { q: string; a: string };
type StatCols = { grp: 'home' | 'penerima'; num: number; suffix: string; label: string };
type FeatureCols = { n: string; title: string; descr: string };
type ProgramSlideCols = { src: string; cap: string | null; meta: string | null };
type GalleryCols = { bg: string; title: string; meta: string | null };
type HeroSlideCols = { src: string; cap: string | null };
type ValuesCols = { n: string; title: string; descr: string };
type TeamCols = { name: string; role: string; avatar: string | null };
type MisiCols = { body: string };
type RekeningCols = { bank: string; no: string; label: string; account_holder: string };
type PenerimaCols = {
  name: string;
  type: 'Pesantren' | 'Yayasan';
  city: string;
  province: string;
  alamat: string | null;
  galon: number;
  lat: number | null;
  lng: number | null;
  status: 'tersalurkan' | 'proses' | 'pengajuan' | 'arsip';
};

export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type Role = 'owner' | 'admin' | 'editor';
export type ActivityAction =
  | 'create' | 'update' | 'delete' | 'login' | 'logout'
  | 'publish' | 'unpublish' | 'site_rebuild' | 'heartbeat';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string; avatar_url: string | null; role: Role } & Timestamps;
        Insert: { id: string; full_name?: string; avatar_url?: string | null; role?: Role } & Partial<Timestamps>;
        Update: Partial<{ full_name: string; avatar_url: string | null; role: Role } & Timestamps>;
      };
      activity_log: {
        Row: {
          id: string; actor_id: string | null; action: ActivityAction;
          entity_type: string | null; entity_id: string | null; summary: string | null;
          metadata: Json; ip: string | null; user_agent: string | null; created_at: string;
        };
        Insert: {
          id?: string; actor_id?: string | null; action: ActivityAction;
          entity_type?: string | null; entity_id?: string | null; summary?: string | null;
          metadata?: Json; ip?: string | null; user_agent?: string | null; created_at?: string;
        };
        Update: never;
      };
      penerima:       { Row: Row<PenerimaCols>;       Insert: Ins<PenerimaCols>;       Update: Upd<PenerimaCols> };
      testimonials:   { Row: Row<TestimonialCols>;    Insert: Ins<TestimonialCols>;    Update: Upd<TestimonialCols> };
      faqs:           { Row: Row<FaqCols>;            Insert: Ins<FaqCols>;            Update: Upd<FaqCols> };
      stats:          { Row: Row<StatCols>;           Insert: Ins<StatCols>;           Update: Upd<StatCols> };
      features:       { Row: Row<FeatureCols>;        Insert: Ins<FeatureCols>;        Update: Upd<FeatureCols> };
      program_slides: { Row: Row<ProgramSlideCols>;   Insert: Ins<ProgramSlideCols>;   Update: Upd<ProgramSlideCols> };
      gallery:        { Row: Row<GalleryCols>;        Insert: Ins<GalleryCols>;        Update: Upd<GalleryCols> };
      hero_slides:    { Row: Row<HeroSlideCols>;      Insert: Ins<HeroSlideCols>;      Update: Upd<HeroSlideCols> };
      values_list:    { Row: Row<ValuesCols>;         Insert: Ins<ValuesCols>;         Update: Upd<ValuesCols> };
      team:           { Row: Row<TeamCols>;           Insert: Ins<TeamCols>;           Update: Upd<TeamCols> };
      misi:           { Row: Row<MisiCols>;           Insert: Ins<MisiCols>;           Update: Upd<MisiCols> };
      rekening:       { Row: Row<RekeningCols>;       Insert: Ins<RekeningCols>;       Update: Upd<RekeningCols> };
      settings: {
        Row: { key: string; value: Json; updated_at: string };
        Insert: { key: string; value?: Json; updated_at?: string };
        Update: Partial<{ key: string; value: Json; updated_at: string }>;
      };
      media: {
        Row: {
          id: string; bucket: string; path: string; filename: string;
          mime: string | null; size: number | null; width: number | null; height: number | null;
          alt: string | null; uploaded_by: string | null; created_at: string;
        };
        Insert: {
          id?: string; bucket?: string; path: string; filename: string;
          mime?: string | null; size?: number | null; width?: number | null; height?: number | null;
          alt?: string | null; uploaded_by?: string | null; created_at?: string;
        };
        Update: Partial<{ alt: string | null; filename: string }>;
      };
      categories: {
        Row: { id: string; name: string; slug: string } & Timestamps;
        Insert: { id?: string; name: string; slug: string } & Partial<Timestamps>;
        Update: Partial<{ name: string; slug: string }>;
      };
      tags: {
        Row: { id: string; name: string; slug: string } & Timestamps;
        Insert: { id?: string; name: string; slug: string } & Partial<Timestamps>;
        Update: Partial<{ name: string; slug: string }>;
      };
      articles: {
        Row: {
          id: string; title: string; slug: string; excerpt: string | null;
          content: Json | null; content_html: string | null; cover_image: string | null;
          status: ArticleStatus; published_at: string | null; author_id: string | null;
          category_id: string | null; meta_title: string | null; meta_description: string | null;
          og_image: string | null; reading_time: number | null; view_count: number;
        } & Timestamps;
        Insert: {
          id?: string; title: string; slug: string; excerpt?: string | null;
          content?: Json | null; content_html?: string | null; cover_image?: string | null;
          status?: ArticleStatus; published_at?: string | null; author_id?: string | null;
          category_id?: string | null; meta_title?: string | null; meta_description?: string | null;
          og_image?: string | null; reading_time?: number | null; view_count?: number;
        } & Partial<Timestamps>;
        Update: Partial<{
          title: string; slug: string; excerpt: string | null; content: Json | null;
          content_html: string | null; cover_image: string | null; status: ArticleStatus;
          published_at: string | null; category_id: string | null; meta_title: string | null;
          meta_description: string | null; og_image: string | null; reading_time: number | null;
          view_count: number;
        }>;
      };
      article_tags: {
        Row: { article_id: string; tag_id: string };
        Insert: { article_id: string; tag_id: string };
        Update: Partial<{ article_id: string; tag_id: string }>;
      };
      contact_submissions: {
        Row: {
          id: string; nama: string; phone: string; email: string | null; topik: string | null;
          pesan: string; honeypot: string | null; status: 'new' | 'read' | 'replied' | 'spam';
          ip: string | null; user_agent: string | null; created_at: string;
        };
        Insert: {
          id?: string; nama: string; phone: string; email?: string | null; topik?: string | null;
          pesan: string; honeypot?: string | null; status?: 'new' | 'read' | 'replied' | 'spam';
          ip?: string | null; user_agent?: string | null; created_at?: string;
        };
        Update: Partial<{ status: 'new' | 'read' | 'replied' | 'spam' }>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_editor: { Args: Record<string, never>; Returns: boolean };
      get_user_role: { Args: Record<string, never>; Returns: string };
      record_activity: {
        Args: {
          p_action: string; p_entity_type?: string; p_entity_id?: string;
          p_summary?: string; p_metadata?: Json;
        };
        Returns: string;
      };
      heartbeat: { Args: Record<string, never>; Returns: string };
      last_heartbeat: { Args: Record<string, never>; Returns: string };
      prune_heartbeats: { Args: { p_days?: number }; Returns: number };
      increment_view: { Args: { p_slug: string }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ── Convenience aliases (keep after regenerating types) ──────────────────────
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Article = Tables<'articles'>;
export type Penerima = Tables<'penerima'>;
export type Testimonial = Tables<'testimonials'>;
export type Faq = Tables<'faqs'>;
export type Stat = Tables<'stats'>;
export type Feature = Tables<'features'>;
export type GalleryItem = Tables<'gallery'>;
export type HeroSlide = Tables<'hero_slides'>;
export type ProgramSlide = Tables<'program_slides'>;
export type TeamMember = Tables<'team'>;
export type ValueItem = Tables<'values_list'>;
export type Misi = Tables<'misi'>;
export type Rekening = Tables<'rekening'>;
export type Category = Tables<'categories'>;
export type Tag = Tables<'tags'>;
export type MediaItem = Tables<'media'>;
export type ActivityEntry = Tables<'activity_log'>;
export type ContactSubmission = Tables<'contact_submissions'>;
export type Profile = Tables<'profiles'>;
