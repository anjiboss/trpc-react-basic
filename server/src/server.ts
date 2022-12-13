import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { z } from "zod";
import cors from "cors";

const PORT = 5000;
// @filename: server.ts
const t = initTRPC.create();
interface User {
  id: string;
  name: string;
}
const userList: User[] = [
  {
    id: "1",
    name: "KATT",
  },
];
const appRouter = t.router({
  userById: t.procedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const input = req.input;
      const user = userList.find((it) => it.id === input);
      return user;
    }),
  hello: t.procedure.query(() => {
    return "hello world";
  }),
  userCreate: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation((req) => {
      const id = String(userList.length + 1);
      const user: User = {
        id,
        name: req.input.name,
      };
      userList.push(user);
      return user;
    }),
  users: t.procedure.query(() => {
    return userList;
  }),
});

export type AppRouter = typeof appRouter;

async function main() {
  // express implementation
  const app = express();

  app.use((req, _res, next) => {
    // request logger
    console.log("⬅️ ", req.method, req.path, req.body ?? req.query);

    next();
  });

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    })
  );
  app.get("/", (_req, res) => res.send("hello"));
  app.listen(PORT, () => {
    console.log("listening on port ", PORT);
  });
}

main();
