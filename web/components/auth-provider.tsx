'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

type AuthState = {
  session: Session | null;
  ready: boolean;
};

const AuthContext = createContext<AuthState>({ session: null, ready: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, ready: false });

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      const timer = window.setTimeout(() => setState({ session: null, ready: true }), 0);
      return () => window.clearTimeout(timer);
    }

    let active = true;
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ session, ready: true });
    });

    client.auth
      .getSession()
      .then(({ data: result, error }) => {
        if (!active) return;
        if (error) {
          console.error('Unable to read the sign-in session:', error.message);
          setState({ session: null, ready: true });
          return;
        }
        setState({ session: result.session, ready: true });
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Unable to read the sign-in session:', error);
        setState({ session: null, ready: true });
      });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
