/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {  loadAllLinksByChunks } from "~/utils/business/chessczLinkLoader";
import { downloadPageOrFile } from "~/utils/business/pageDownloader";
import { parsePgnFile } from "~/utils/business/pgnParser";

export const chessczRouter = createTRPCRouter({
  links: publicProcedure
  .query(async () => {
    const links = (await prisma.link.findMany()).map(l => l.url);
    const linksWithMetadata = await Promise.all(links.map(async (link) => {
      const isLinkParsed = await prisma.pgn.findFirst({where: {sourceUrl: {equals: link}}});
      return ({url: link, isParsed: !!isLinkParsed});
    }));
    return linksWithMetadata;
  }), 
  refreshAllLinks: publicProcedure
    .query(async () => {
      for await(const linksChunk of loadAllLinksByChunks()) {
        const pgnLinksOnly = linksChunk.filter(l => l.url.endsWith('pgn')).map(l => ({...l, url:l.url.trim()}));
        try{
          await prisma.link.createMany({data: pgnLinksOnly, skipDuplicates: true});
        } catch(e) {
          console.log('Error', JSON.stringify(e));
        }
      }
    }),
  saveGamesFromUrl: publicProcedure
  .input(z.object({url: z.string()}))
  .mutation(async({input}) => {
    try{
      const file = await downloadPageOrFile(input.url);
      const parsedPgns = parsePgnFile(file).map(pgn => ({...pgn, sourceUrl: input.url}));
      const result = await prisma.pgn.createMany({data: parsedPgns,  skipDuplicates: true});
      return result.count;
    }catch(e) {
      console.log("ERROR", JSON.stringify(e));
      throw e;
    }
  }),

});
