import { type IPgn } from "../interfaces/IPgn";

const getHeader = (headerName: string) => (pgn: string) => {
    const startString = `[${headerName} "`;
    const endString = ']';

    if (pgn.indexOf(startString) === -1) return '';

    const startOf = pgn.indexOf(startString) + startString.length;
    const endOf = pgn.indexOf(endString, startOf) - endString.length;
    const result = pgn.substring(startOf, endOf);
    return result;

}

export const getEvent = (pgn: string): string | undefined => {
    return getHeader('Event')(pgn);
}

export const getBlack = (pgn: string): string | undefined => {
    return getHeader('Black')(pgn);
}
export const getWhite = (pgn: string): string | undefined => {
    return getHeader('White')(pgn);
}
export const getEco = (pgn: string): string | undefined => {
    return getHeader('ECO')(pgn);
}
export const getResult = (pgn: string): string | undefined => {
    return getHeader('Result')(pgn);
}
export const getWhiteElo = (pgn: string): string | undefined => {
    return getHeader('WhiteElo')(pgn);
}
export const getBlackElo = (pgn: string): string | undefined => {
    return getHeader('BlackElo')(pgn);
}
export const getPlyCount = (pgn: string): string | undefined => {
    return getHeader('PlyCount')(pgn);
}
export const geEventDate = (pgn: string): string | undefined => {
    return getHeader('EventDate')(pgn);
}
export const getSite = (pgn: string): string | undefined => {
    return getHeader('Site')(pgn);
}
const toDate = (str: string): Date | undefined => {
    let result = undefined;
    try {
        result = new Date(str);
        if (result.toString() === 'Invalid Date') return undefined;
    } catch (error) {
        console.log("error: ", error);
    }
    return result;
}

export const getDate = (pgn: string): Date | undefined => {
    const header = getHeader('Date')(pgn);
    return toDate(header);
}
export const getRound = (pgn: string): string | undefined => {
    return getHeader('Round')(pgn);
}
export const getEventDate = (pgn: string): Date | undefined => {
    const header = getHeader('EventDate')(pgn);
    return toDate(header);
}

const getMoves = (pgn: string) => {
    const endOfHeaders = pgn.lastIndexOf(']') + 1;
    const afterHeaders = pgn.substring(endOfHeaders);

    return afterHeaders.trim();
}

export const parseSinglePgn = (pgn: string): IPgn => {
    console.log('getPlyCount(pgn):', getPlyCount(pgn))
    return {
        moves: getMoves(pgn),
        blackElo: getBlackElo(pgn) ? Number(getBlackElo(pgn)) : undefined,
        eco: getEco(pgn),
        black: getBlack(pgn),
        event: getEvent(pgn),
        plyCount: getPlyCount(pgn) ? Number(getPlyCount(pgn)) : undefined,
        result: getResult(pgn),
        round: getRound(pgn),
        site: getSite(pgn),
        white: getWhite(pgn),
        whiteElo: getWhiteElo(pgn) ? Number(getWhiteElo(pgn)) : undefined,
        eventDate: getEventDate(pgn),
        date: getDate(pgn),
        pgn: pgn,

    } as IPgn;
}

export const parsePgnFile = (pgnFile: string): IPgn[] => {
    console.log("Starting to parse pgn file");
    let rest = pgnFile.trim();
    let numberOfIterations = 0;

    const results: IPgn[] = [];

    while (true) {
        // console.log("Rest length: ", rest.length);
        numberOfIterations++;
        if (numberOfIterations > 1000) throw new Error(`Number of iterations exceeded. Restfile is: ${rest}`);
        if (rest === '' || rest.length === 0) break;

        const regex = new RegExp('[\d]\.\ [^\ ]+\ [^\ ]+\ ', 'g');
        regex.test(rest);

        const startIdxOfMoves = regex.lastIndex;
        if (startIdxOfMoves === 0) break;

        const endResult1 = '1-0';
        const endResult2 = '1/2-1/2';
        const endResult3 = '0-1';

        const possibleEndings = [
            rest.indexOf(endResult1, startIdxOfMoves) + endResult1.length,
            rest.indexOf(endResult2, startIdxOfMoves) + endResult2.length,
            rest.indexOf(endResult3, startIdxOfMoves) + endResult3.length];

        const existingEndings = possibleEndings.filter(idx => idx > 30);
        if (existingEndings.length === 0) break;

        const nextEnding = Math.min(...existingEndings);
        const nextPgn = rest.substring(0, nextEnding).trim();

        results.push(parseSinglePgn(nextPgn));
        rest = rest.substring(nextEnding);
    }

    return results;
}

