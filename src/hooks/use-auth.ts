"use client";

import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
