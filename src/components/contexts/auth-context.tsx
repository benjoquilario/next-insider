import * as React from 'react';
import { type User } from '@prisma/client';

export type AuthContextType = {
  session: User | null;
  setSession: (user: User | null) => void;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);
