import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // create user account
      const prisma = ctx.prisma;
      const hashedPass = bcrypt.hashSync(input.password, saltRounds);
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          CredentialPassword: {
            create: {
              password: hashedPass,
            },
          },
        },
      });

      // return user
      return {
        name: user.name,
        email: user.email,
      };
    }),
});
