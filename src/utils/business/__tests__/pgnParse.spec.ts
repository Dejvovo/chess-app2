/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import fs from 'fs';
import { parsePgnFile } from '../pgnParser';

describe("Tests of parsing pgn", () => {
    it("should correclty parse following pgn: ksb_sss_1516.pgn", async () => {
        const filename = 'ksb_sss_1516.pgn';
        const inputFilePath = `${__dirname}/inputs/${filename}`;

        const inputFile = fs.readFileSync(inputFilePath).toString();
        const result = parsePgnFile(inputFile);

        expect(result).toMatchSnapshot();

    })
})