import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { downloadPageOrFile } from "~/utils/business/pageDownloader";
import { parsePgnFile } from "~/utils/business/pgnParser";

export const gamesRouter = createTRPCRouter({
    storeGamesFromLinks: publicProcedure
    .input(z.object({
        from: z.date(),
        to: z.date(),
    }))
    .mutation(async({input}) => {
        try{
            const links = await prisma.link.findMany({where: {datetime: {gte: input.from, lte:  input.to}}});
            console.log(`Found ${links.length} in range ${input.from.getDate()} - ${input.to.getDate()}`)

            let linksParsed = 0
            for(const link of links) {
              try{ 
                const file = await downloadPageOrFile(link.url);
                const parsedPgns = parsePgnFile(file).map(pgn => ({...pgn, sourceUrl: link.url}));
                await prisma.pgn.createMany({data: parsedPgns,  skipDuplicates: true});
        
              } catch(e) {
                console.log('Something bad happenned', e);
              }
              console.log(`Parsed ${linksParsed} links out of ${links.length}`);
              linksParsed++;
            }
          }catch(e) {
            console.log("ERROR", JSON.stringify(e));
            throw e;
          }
    })
})