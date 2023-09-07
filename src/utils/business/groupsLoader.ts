/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import parse from 'node-html-parser';
import {type HTMLElement} from 'node-html-parser';
import { downloadPageOrFile } from './pageDownloader';

interface IGroup {
    code: number;
    name: string;
    locality: string;
    www: string;
    email: string;
    players: string;
    contact: string;
    urlId: number // ID, which is used for loading main page of the group.
}

const getGroupsTableElement = (html: HTMLElement) =>  html.querySelector('tbody');
const getRows = (tbody: HTMLElement) =>  tbody.querySelectorAll('tr');
const getColumns = (tr: HTMLElement) => tr.querySelectorAll('td'); 

const getUrlId = (columns: HTMLElement[]): string => {
    const hrefStart  ='href="https://www.chess.cz/oddil/';
    return (columns[1]!.firstChild as any).rawAttrs.substring(hrefStart.length, hrefStart.length + 5) as string;
}

const getGroupFromRow = (tr: HTMLElement): IGroup => {
    const columns = getColumns(tr);
    return {
        code: Number(columns[0]!.innerText),
        name: columns[1]!.innerText,
        locality: columns[2]!.innerText,
        www: columns[3]!.innerText,
        email   : columns[4]!.innerText,
        players: columns[5]!.innerText,
        contact: columns[6]!.innerText.trim(),
        urlId: Number(getUrlId(columns))
    };
}

const getGroupsFromTable = (table: HTMLElement): IGroup[] => getRows(table).map(getGroupFromRow);


export const loadAllGroups = async (): Promise<IGroup[]> => {
    const groupsUrl = (page: number) => `https://www.chess.cz/vyhledavani-oddilu/?pageNumber=${page}&oddilName=&kraj=&city=&sortOddil=1`;
    const allGroups: IGroup[] = [];

    const maxNumberOfPages = 100;
    for(let i=1; i < maxNumberOfPages; i++) {
        const pageNumber = i;
        const html = parse(await downloadPageOrFile(groupsUrl(pageNumber)));
        const htmlTable= getGroupsTableElement(html);

        if(htmlTable === null) break;

        getGroupsFromTable(htmlTable).forEach(group => allGroups.push(group));
        await sleep(2000);
    }

    return allGroups;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

