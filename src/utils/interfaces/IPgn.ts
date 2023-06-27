export interface IPgn {
    moves: string;
    event?: string;
    site?: string;
    date?: Date;
    round?: string;
    result?: string;
    white: string;
    black: string;
    eco?: string;
    whiteElo?: number;
    blackElo?: number;
    plyCount?: number;
    eventDate?: Date;
    pgn: string;
    sourceDate: Date;
    sourceUrl: string;
}