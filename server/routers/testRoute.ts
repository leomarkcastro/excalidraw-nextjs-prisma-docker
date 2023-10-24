import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const testRouter = router({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return {
        greeting: `[AUTH] hello [${ctx.session.user.name}] -> ${input.text}`,
      };
    }),
});
