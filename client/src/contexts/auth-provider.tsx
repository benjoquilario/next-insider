import * as React from 'react';
import { AuthContext } from './auth-context';
import { sessionDefaultValue } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState(sessionDefaultValue);

  const refreshSession = async () => {
    const res = await fetch('http://localhost:5000/auth/refresh', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      setSession({ status: 'unauthenticated', accessToken: null, user: null });
      return;
    }

    const data = await res.json();

    setSession({ ...data, status: 'authenticated' });
  };

  React.useEffect(() => {
    if (session.accessToken || session.user) return;

    refreshSession();

    const interval = setInterval(refreshSession, 14 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}
