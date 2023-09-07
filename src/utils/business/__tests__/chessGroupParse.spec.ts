/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { loadAllGroups } from '../groupsLoader';


describe("Tests of parsing chess groups", () => {
    it("should correclty parse chess groups", async () => {
        expect(await loadAllGroups()).toBe({})
    }, 200000)
})