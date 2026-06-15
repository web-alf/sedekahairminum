import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { Role } from '@/lib/supabase/types';

// Routes under /admin that require an admin/owner role (not just editor).
const ADMIN_ONLY_PREFIXES = ['/admin/settings', '/admin/users', '/admin/activity', '/admin/submissions'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, locals, url, redirect, request } = context;
  const runtimeEnv = locals.runtime?.env as Record<string, string> | undefined;

  const supabase = createSupabaseServer(cookies, runtimeEnv, request.headers.get('cookie'));
  locals.supabase = supabase;
  locals.user = null;
  locals.role = null;

  const path = url.pathname;
  const needsAuth = path.startsWith('/admin') && path !== '/admin/login';
  const isLogin = path === '/admin/login';

  // Only hit the auth server when it matters (admin area, login, or API).
  if (needsAuth || isLogin || path.startsWith('/api/')) {
    const { data: { user } } = await supabase.auth.getUser();
    locals.user = user ?? null;
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single<{ role: Role }>();
      locals.role = profile?.role ?? null;
    }
  }

  if (needsAuth && !locals.user) {
    return redirect(`/admin/login?next=${encodeURIComponent(path)}`);
  }
  if (needsAuth && ADMIN_ONLY_PREFIXES.some((p) => path.startsWith(p))) {
    if (locals.role !== 'owner' && locals.role !== 'admin') {
      return redirect('/admin?error=forbidden');
    }
  }
  if (isLogin && locals.user) {
    return redirect('/admin');
  }

  return next();
});
