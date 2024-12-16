import * as React from 'react';
import { type User } from '@/types';

interface Session {
  status: 'authenticated' | 'loading' | 'unauthenticated';
  accessToken: string | null;
  user: User | null;
}

export const sessionDefaultValue: Session = {
  status: 'loading',
  accessToken: null,
  user: null,
};

export const AuthContext = React.createContext<{
  session: Session;
  setSession: React.Dispatch<React.SetStateAction<Session>>;
}>({
  session: sessionDefaultValue,
  setSession: () => {},
});
