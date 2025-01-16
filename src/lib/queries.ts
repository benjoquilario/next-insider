import { cookies } from 'next/headers';
import { verifyToken } from './auth/session';
import db from './db';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);

  if (!sessionData || !sessionData.user) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: sessionData.user.id,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}
