import { z } from 'zod';
import { protectedProcedure, router, semiProtectedProcedure } from '../trpc';

const notebookRoles = {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
};

export const excalidrawRouter = router({
  // notebook_create
  notebook_create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      return await ctx.prisma.notebook.create({
        data: {
          name: input.name,
          description: input.description,
          Members: {
            create: {
              accountId: userID,
              role: notebookRoles.OWNER,
            },
          },
        },
      });
    }),
  // notebook_update_details
  notebook_update_details: protectedProcedure
    .input(
      z.object({
        notebookId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const notebook = await ctx.prisma.notebook.findFirst({
        where: {
          id: input.notebookId,
          Members: {
            some: {
              accountId: userID,
              role: notebookRoles.OWNER,
            },
          },
        },
      });
      if (!notebook) {
        throw new Error('Notebook not found');
      }
      await ctx.prisma.notebook.update({
        where: {
          id: input.notebookId,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  // notebook_update_members
  notebook_update_members: protectedProcedure
    .input(
      z.object({
        notebookId: z.string(),
        members: z.array(
          z.object({
            accountId: z.string(),
            role: z.enum([notebookRoles.EDITOR, notebookRoles.VIEWER]),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const notebook = await ctx.prisma.notebook.findFirst({
        where: {
          id: input.notebookId,
          Members: {
            some: {
              accountId: userID,
              role: notebookRoles.OWNER,
            },
          },
        },
      });
      if (!notebook) {
        throw new Error('Notebook not found');
      }
      await ctx.prisma.notebook.update({
        where: {
          id: input.notebookId,
        },
        data: {
          Members: {
            deleteMany: {},
            createMany: {
              data: input.members,
            },
          },
        },
      });
    }),
  // notebook_delete
  notebook_delete: protectedProcedure
    .input(
      z.object({
        notebookId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const notebook = await ctx.prisma.notebook.findFirst({
        where: {
          id: input.notebookId,
          Members: {
            some: {
              accountId: userID,
              role: notebookRoles.OWNER,
            },
          },
        },
      });
      if (!notebook) {
        throw new Error('Notebook not found');
      }
      await ctx.prisma.notebook.delete({
        where: {
          id: input.notebookId,
        },
      });
    }),
  // notebook_get
  notebook_get: protectedProcedure
    .input(
      z.object({
        notebookId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const notebook = await ctx.prisma.notebook.findFirst({
        where: {
          id: input.notebookId,
          Members: {
            some: {
              accountId: userID,
            },
          },
        },
        include: {
          Members: true,
          Pages: true,
        },
      });
      if (!notebook) {
        throw new Error('Notebook not found');
      }
      return notebook;
    }),
  // notebook_list
  notebook_list: protectedProcedure.query(async ({ ctx }) => {
    const userID = ctx.session.user.id;
    return await ctx.prisma.notebook.findMany({
      where: {
        Members: {
          some: {
            accountId: userID,
          },
        },
      },
      include: {
        Pages: {
          include: {
            Content: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });
  }),

  // page_create
  page_create: protectedProcedure
    .input(
      z.object({
        notebookId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const notebook = await ctx.prisma.notebook.findFirst({
        where: {
          id: input.notebookId,
          Members: {
            some: {
              accountId: userID,
              OR: [
                {
                  role: notebookRoles.OWNER,
                },
                {
                  role: notebookRoles.EDITOR,
                },
              ],
            },
          },
        },
      });
      if (!notebook) {
        throw new Error('Notebook not found');
      }
      const page = await ctx.prisma.page.create({
        data: {
          name: input.name,
          description: input.description,
          notebookId: input.notebookId,
        },
      });
      return page.id;
    }),
  // page_update
  page_delete: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const page = await ctx.prisma.page.findFirst({
        where: {
          id: input.pageId,
          Notebook: {
            Members: {
              some: {
                accountId: userID,
                OR: [
                  {
                    role: notebookRoles.OWNER,
                  },
                  {
                    role: notebookRoles.EDITOR,
                  },
                ],
              },
            },
          },
        },
      });
      if (!page) {
        throw new Error('Page not found');
      }
      await ctx.prisma.page.delete({
        where: {
          id: input.pageId,
        },
      });
    }),
  // page_delete
  page_update: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        name: z.string(),
        description: z.string(),
        public: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const page = await ctx.prisma.page.findFirst({
        where: {
          id: input.pageId,
          Notebook: {
            Members: {
              some: {
                accountId: userID,
                OR: [
                  {
                    role: notebookRoles.OWNER,
                  },
                  {
                    role: notebookRoles.EDITOR,
                  },
                ],
              },
            },
          },
        },
      });
      if (!page) {
        throw new Error('Page not found');
      }
      await ctx.prisma.page.update({
        where: {
          id: input.pageId,
        },
        data: {
          name: input.name,
          description: input.description,
          public: input.public,
        },
      });
    }),
  // page_get
  page_get: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const page = await ctx.prisma.page.findFirst({
        where: {
          id: input.pageId,
          Notebook: {
            Members: {
              some: {
                accountId: userID,
              },
            },
          },
        },
        include: {
          Content: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
      if (!page) {
        throw new Error('Page not found');
      }
      return page;
    }),
  // page_list
  page_list: protectedProcedure
    .input(
      z.object({
        notebookId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      return await ctx.prisma.page.findMany({
        where: {
          id: input.notebookId,
          Notebook: {
            Members: {
              some: {
                accountId: userID,
              },
            },
          },
        },
        include: {
          Content: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    }),

  // content_get_latest
  content_get: semiProtectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        contentId: z.string().nullable(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userID = ctx.session?.user.id ?? 'xxxosoa';
      if (input.contentId) {
        const content = await ctx.prisma.content.findFirst({
          where: {
            id: input.contentId,
            OR: [
              {
                Page: {
                  Notebook: {
                    Members: {
                      some: {
                        accountId: userID,
                      },
                    },
                  },
                },
              },
              {
                Page: {
                  public: true,
                },
              },
            ],
          },
          include: {
            Page: {
              include: {
                Notebook: true,
              },
            },
          },
        });
        if (!content) {
          throw new Error('Content not found');
        }
        return {
          content,
          documentName: `${content.Page?.Notebook.name} - ${content.Page?.name}`,
          isPublic: content.Page?.public,
        };
      }
      const page = await ctx.prisma.page.findFirst({
        where: {
          id: input.pageId,

          OR: [
            {
              Notebook: {
                Members: {
                  some: {
                    accountId: userID,
                  },
                },
              },
            },
            {
              public: true,
            },
          ],
        },
        include: {
          Content: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
          Notebook: true,
        },
      });
      if (!page) {
        throw new Error('Page not found');
      }
      return {
        content: page.Content[0],
        documentName: `${page.Notebook.name} - ${page.name}`,
        isPublic: page.public,
      };
    }),
  // content_update
  content_update: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        files: z.string(),
        content: z.string(),
        appState: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userID = ctx.session.user.id;
      const page = await ctx.prisma.page.findFirst({
        where: {
          id: input.pageId,
          Notebook: {
            Members: {
              some: {
                accountId: userID,
                OR: [
                  {
                    role: notebookRoles.OWNER,
                  },
                  {
                    role: notebookRoles.EDITOR,
                  },
                ],
              },
            },
          },
        },
      });
      if (!page) {
        throw new Error('Page not found');
      }
      if (!input.content) {
        return null;
      }
      // check if page exists
      // if page exists and its created 6 hours ago, create a new page
      // else update the page
      const _VERSION_EVERY = 1000 * 60 * 10; // 10 minutes

      const content = await ctx.prisma.content.findFirst({
        where: {
          pageId: input.pageId,
          createdAt: {
            gte: new Date(new Date().getTime() - _VERSION_EVERY),
          },
        },
      });
      if (!content) {
        return await ctx.prisma.content.create({
          data: {
            content: input.content,
            files: input.files,
            appState: input.appState,
            pageId: input.pageId,
          },
        });
      } else {
        return await ctx.prisma.content.update({
          where: {
            id: content.id,
          },
          data: {
            files: input.files,
            content: input.content,
            appState: input.appState,
          },
        });
      }
    }),
});
