/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const pgns = api.db.pgns.useQuery().data || [];
  return (
    <>
    hello world
    {pgns.map(pgn => <div key={pgn.black}>{pgn.black}</div>)}
    </>
  );
}
