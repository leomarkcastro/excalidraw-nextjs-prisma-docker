# NextJS Full Stack Boilerplate

This boilerplate uses the following technologies/framework:

- NextJS React
- Tailwind + DaisyUI
- Next Auth (Credentials Setup / OAuth Ready)
- tRPC, React Query and Zod for Backend Logic
- Prisma ORM + SQLite Database
- Easy Peasy for State Management
- SWR for Data Fetching on External API
- Husky Hooks for Pre-Commit and Pre-Push. Uses convention commit for commit messages
- VS Code Workspace Snippet for Component Creation
- Auto Format on Save

With these technologies, you can effectively build a full stack website like a simple landing page, blog site, survey site and many more.

---

## Starting Up

The following steps will show you the basic steps to spin up the server

### 1. Download the Repository

```
git clone --depth 1 https://github.com/leomarkcastro/leo_nextjs_boilerplate.git <project_name>

```

### 2. Download and Install the Yarn Packages

```
yarn
```

### 3. Initialize the Prisma Database

```
npx prisma db push
```

### 4. Run the server

```
yarn dev
```

This should be enough to run the core server.
