/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {parse} from 'node-html-parser';
import fetch from 'node-fetch';

/**
 * Hierarchy of website is as follows: 
 *  - top_level_dir (only one)
 *      -bottom_level_dir1
 *          file1.pgn
 *          file2.pdf
 *      -bottom_level_dir2
 *          file1.pgn
 *          file2.pdf
 *      -bottom_level_dir3
 *          file1.pgn
 *          file2.pgn
 *          file3.pgn
 *          file4.pgn
 */

interface ILink {
    url: string;
    date: string; // Date in format as it is written in document. e.g: 1.4.2016 15:12   
}

const logDev = (message:string) => {if(process.env.NODE_ENV === 'development') console.log(message)};

const fetchForSure = async (url: string) => {
    for(let i = 0; i< 10; i++) {
        try{
            const fetched = await (fetch(url));
            return fetched;
        }
        catch(e) {
            console.log('Loading was not successful, trying again...', e);
        }
        await sleep(1000);
    }
};

export const loadHtml = async (url: string) => {
    logDev(url);
    const mainSiteStream = await (fetchForSure(url));
    if(!mainSiteStream) return '';
    
    const mainSiteHtml = await (mainSiteStream).text();
    // logDev('MainSite');
    // logDev(mainSiteHtml)
    const htmlPrepared = mainSiteHtml.toLowerCase().replaceAll('&lt;dir&gt;', '');
    return htmlPrepared;
}

export const loadLinks = async (url: string): Promise<ILink[]> => {
    const html = await loadHtml(url);
    const htmlParser = parse(html);
    const preTag = htmlParser.querySelector('pre');

    const innerHTML = preTag?.innerHTML || '';
    const linksParsed = parse(innerHTML).querySelectorAll('a');

    const result = linksParsed.filter(link => !!link.previousSibling).map(linkParsed => {
        const linksDate = linkParsed.previousSibling.innerText; 
        const trimedDate = linksDate.trim().split(' ').filter(s => s !== "").join(' ');

        const linksHref = linkParsed.attributes['href'] || '';

        return {
            url: linksHref,
            date: trimedDate
        }
    })

    return result;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// export const loadAllLinks = async (baseUrl= 'https://db2.chess.cz', topDirUrlRelative = '/Uploads/Competitions/Files/'): Promise<ILink[]> => { 
//     const topDirUrl = baseUrl + topDirUrlRelative;
//     const topDirLinks = await loadLinks(topDirUrl);
//     console.log("Top dir links loaded.", topDirLinks.length);
//     let bottomDirLinks: ILink[] = [];

//     const allLinks = topDirLinks.length;
//     let processedLinks = 0;
//     for(const topDirLink of topDirLinks) {
//         console.log(`Processed ${processedLinks} out of ${allLinks}`);
//         processedLinks++;

//         const bottomlinks = await loadLinks(baseUrl + topDirLink.url);
//         console.log("Chunk of bottom links loaded.", bottomlinks.length);
//         bottomDirLinks = [...bottomDirLinks, ...bottomlinks]; 
//         await sleep(1000);
//     }
//     console.log("All chunks loaded.");
//     return bottomDirLinks;
// }

export async function* loadAllLinksByChunks(baseUrl= 'https://db2.chess.cz', topDirUrlRelative = '/Uploads/Competitions/Files/') { 
    const topDirUrl = baseUrl + topDirUrlRelative;
    const topDirLinks = await loadLinks(topDirUrl);
    console.log("Top dir links loaded.", topDirLinks.length);
    let bottomDirLinks: ILink[] = [];

    const allLinks = topDirLinks.length;
    let processedLinks = 0;
    for(const topDirLink of topDirLinks) {
        console.log(`Processed ${processedLinks} out of ${allLinks}`);
        processedLinks++;

        const bottomlinks = (await loadLinks(baseUrl + topDirLink.url)).map(l => ({...l, url:`${baseUrl}${l.url}`}));
        yield bottomlinks;
        console.log("Chunk of bottom links loaded.", bottomlinks.length);
        bottomDirLinks = [...bottomDirLinks, ...bottomlinks]; 
    }
    console.log("All chunks loaded.");  
    return bottomDirLinks;
}

