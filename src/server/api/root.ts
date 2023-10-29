import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { dbRouter } from "./routers/db";
import { chessczRouter } from "./routers/chesscz";
import { gamesRouter } from "./routers/games";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  db: dbRouter,
  chesscz: chessczRouter,
  games: gamesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
