import { supabase } from '../lib/supabase';

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
export function getToken() {
  const keys = Object.keys(localStorage);
  return keys.some(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    ? 'supabase-session'
    : null;
}
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}
export async function signUp({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },          
    },
  });
  return { data, error };
}
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
export function removeToken() {
  supabase.auth.signOut();
}
