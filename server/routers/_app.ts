import { router } from '../trpc';
import { authRouter } from './auth';
import { excalidrawRouter } from './excalidrawRoute';
import { testRouter } from './testRoute';

export const appRouter = router({
  test: testRouter,
  auth: authRouter,
  excalidraw: excalidrawRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
