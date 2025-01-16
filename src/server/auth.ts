'use server';

import * as z from 'zod';
import db from '@/lib/db';
import { ActionState, validatedAction } from '@/lib/auth/middleware';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const login = validatedAction(
  signInSchema,
  async (data, _: ActionState) => {
    const { email, password } = data;

    if (!email || !password) return null;

    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        error: 'Invalid email or password',
        email,
        password,
      };
    }

    const isPasswordValid = await comparePasswords(password, user.password!);

    if (!isPasswordValid) {
      return {
        error: 'Invalid email or password',
        email,
        password,
      };
    }

    await setSession(user);

    redirect('/');
  }
);

const registerSchema = signInSchema.extend({
  firstName: z.string().min(4),
  lastName: z.string().min(4),
  confirmPassword: z.string().min(4, {
    message: 'Password must be at least 4 character',
  }),
});

export const createUser = validatedAction(
  registerSchema,
  async (data, _: ActionState) => {
    const { email, firstName, lastName, password, confirmPassword } = data;

    console.log(email, firstName, lastName, password, confirmPassword);

    const isEmailExist = await db.user.findFirst({
      where: { email },
    });

    if (isEmailExist) {
      return {
        error: 'User already exist',
      };
    }

    const hashedPassword = await hashPassword(password);
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    if (password !== confirmPassword) {
      return {
        error: 'The passwords did not match',
      };
    }

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        image: `/avatar-${randomNumber}.png`,
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      },
    });

    await setSession(user);

    redirect('/');
  }
);
