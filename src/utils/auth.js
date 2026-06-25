import { supabase } from '../lib/supabase';

/** Ambil session aktif (null jika belum login) */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Cek apakah ada token Supabase tersimpan di localStorage */
export function getToken() {
  const keys = Object.keys(localStorage);
  return keys.some(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    ? 'supabase-session'
    : null;
}

/** Login dengan email + password → Supabase Auth */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/** Register akun baru → Supabase Auth (metadata.full_name disimpan agar trigger bisa baca) */
export async function signUp({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });
  return { data, error };
}

/** Logout dari Supabase Auth */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** Force sign-out (legacy helper) */
export function removeToken() {
  supabase.auth.signOut();
}

/**
 * Ambil profil user yang sedang login dari tabel `profiles`.
 * Kolom tabel: id, full_name, phone, role, avatar_url, created_at, updated_at.
 * Email diambil dari auth session (tidak ada kolom email di profiles).
 * Fallback ke auth user_metadata jika query gagal.
 * Return: { id, name, email, role, avatar_url, points, tier } atau null jika tidak login.
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { id, email, user_metadata } = session.user;

  // Coba ambil dari tabel profiles
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, avatar_url, points, tier')
      .eq('id', id)
      .maybeSingle();

    if (!error && profile) {
      return {
        id:         profile.id,
        name:       profile.full_name  || user_metadata?.full_name || email?.split('@')[0],
        email:      email || '',
        role:       profile.role       || 'user',
        avatar_url: profile.avatar_url || null,
        points:     profile.points     ?? 0,
        tier:       profile.tier       || 'Bronze',
      };
    }
  } catch {
    // Tabel profiles mungkin belum ada / schema mismatch → fallback
  }

  // Fallback: profiles error atau belum ada
  return {
    id,
    name:      user_metadata?.full_name || email?.split('@')[0],
    email:     email || '',
    role:      'user',
    avatar_url: null,
    points:    0,
    tier:      'Bronze',
  };
}

