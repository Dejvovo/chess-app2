/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {  loadAllLinksByChunks } from "~/utils/business/chessczLinkLoader";

export const chessczRouter = createTRPCRouter({
    refreshAllLinks: publicProcedure
    .query(async () => {
      await prisma.link.deleteMany();
      for await(const linksChunk of loadAllLinksByChunks()) {
        const pgnLinksOnly = linksChunk.filter(l => l.url.endsWith('pgn'));
        await prisma.link.createMany({data: pgnLinksOnly});
      }
    })
});
