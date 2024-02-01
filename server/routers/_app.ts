import { generateOpenApiDocument } from 'trpc-openapi';
import { router } from '../trpc';
import { authRouter } from './auth';
import { excalidrawRouter } from './excalidrawRoute';
import { testRouter } from './testRoute';

export const appRouter = router({
  test: testRouter,
  auth: authRouter,
  excalidraw: excalidrawRouter,
});

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Excalidraw CRUD API',
  description: 'OpenAPI compliant REST API built using tRPC with Next.js',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000/api',
});

// export type definition of API
export type AppRouter = typeof appRouter;
