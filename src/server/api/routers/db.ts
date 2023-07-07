/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
    }),
  infinitePgns: publicProcedure 
  .input(
    z.object({
      pagination: z.object({
        page: z.number().min(0),
        pageSize: z.number().min(1).max(100)}).nullish(),
      filter: z.object({
          items: z.array(z.object({
            field: z.string(),
            operator: z.string(),
            id: z.any(),
            value: z.string().nullish(),
          })),
      }).nullish()
    })
    )
  .query(async ({ctx, input}) => {
    const count = await ctx.prisma.pgn.count();

    const inputFilter = (input.filter!.items[0] && input.filter!.items[0].value !== undefined) ? input.filter!.items[0] : undefined;

    const result = await ctx.prisma.pgn.findMany({  
      take: input.pagination?.pageSize,
      skip: input.pagination ? input.pagination?.page * input.pagination?.pageSize : 0,
      where: inputFilter && {OR: [{[inputFilter.field]: {contains: inputFilter.value}}]}
    });
    return {count, result};
  })
});
