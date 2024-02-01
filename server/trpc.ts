import { initTRPC, TRPCError } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import { Context } from './context';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

// Base router and procedure helpers
export const router = t.router;

const isAuthed = t.middleware(({ next, ctx }) => {
  // check if session exists
  if (!ctx.session?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

const isOptionalAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.id) {
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const semiProtectedProcedure = t.procedure.use(isOptionalAuthed);
