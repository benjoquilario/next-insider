import { AuthContext } from '@/contexts/auth-context';
import * as React from 'react';

export function useSession() {
  const { session, setSession } = React.useContext(AuthContext);

  const logout = async () => {
    const res = await fetch(`http://localhost:5000/auth/signout`, {
      credentials: 'include',
    });

    if (!res.ok) return alert('Error logging out');

    setSession({
      accessToken: null,
      user: null,
      status: 'unauthenticated',
    });
  };

  return { ...session, logout };
}
