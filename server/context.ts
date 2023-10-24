import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const session = await getSession({ req: opts.req });
  const prisma = await import('@/lib/server/prismadb');

  return {
    session,
    prisma: prisma.default,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
