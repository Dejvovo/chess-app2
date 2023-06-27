/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios from 'axios';


export const downloadPage = async (url: string) => {
    const body = await axios<string>(url, { timeout: 4000 });
    return body.data;
}

