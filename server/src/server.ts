import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { z } from "zod";
import cors from "cors";
import { userService } from "./services/user";

const PORT = 5000;
// @filename: server.ts
const t = initTRPC.create();

const appRouter = t.router({
  userById: t.procedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(async (req) => {
      const input = req.input;
      return await userService.findWithId(input);
    }),
  hello: t.procedure.query(() => {
    return "hello world";
  }),
  userCreate: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async (req) => {
      return await userService.create({ name: req.input.name });
    }),
  users: t.procedure.query(async () => {
    return await userService.getAll();
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
