import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';

export default function ProtectedRoute() {
  const [session, setSession] = useState(undefined); // undefined = masih loading

  useEffect(() => {
    // Cek session awal
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Subscribe perubahan auth (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Masih loading session awal
  if (session === undefined) return <Loading />;

  // Belum login → redirect ke /login
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
