/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataGrid } from "@mui/x-data-grid";
import { api } from "~/utils/api";


export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const pgns = api.db.pgns.useQuery().data || [];
  return (
    <>

    <DataGrid rows={pgns} columns={pgns[0] ? Object.keys(pgns[0]).map(key => ({field: key})): []}></DataGrid>
    </>
  );
}
