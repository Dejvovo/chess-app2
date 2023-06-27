import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { downloadPageOrFile } from "~/utils/business/pageDownloader";
import { parsePgnFile } from "~/utils/business/pgnParser";

export const dbRouter = createTRPCRouter({
  createManyPgnsFromUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input, ctx }) => {
      const pgnFile = await downloadPageOrFile(input.url); 
      const pgns = parsePgnFile(pgnFile);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await ctx.prisma.pgn.createMany({data: pgns});
      return parsePgnFile(pgnFile);
    }),
  pgns: publicProcedure
    .query(async ({ctx}) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return await ctx.prisma.pgn.findMany();
    })
});
