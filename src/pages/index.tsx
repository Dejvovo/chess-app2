/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { LinearProgress } from "@mui/material";
import { DataGrid, type GridFilterModel, type GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";


interface IPgnsInput {
  skip: number,
  take: number,
  filters: {white?: {operator: string, value: string}}
}

interface IInput {
  pagination?: GridPaginationModel
  filters?: GridFilterModel
}

export default function Home() {
  const [rowCount, setRowCount] = useState<number>();
  const [rows, setRows] = useState<typeof pgns>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 25});

  const { data, isLoading } = api.db.infinitePgns.useQuery({pagination: paginationModel});

  const pgns = data?.result || [];
  
  useEffect(() => {
    setRowCount((prev) => data?.count ? data.count : prev);
    setRows((prev) => data?.result ? data.result : prev);

  }, [data?.count, data?.result]);

  return (
    <>

      <DataGrid 

        rows={rows} 

        paginationMode={'server'}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {setPaginationModel(model); console.log(model)}}
        rowCount={rowCount}
        
        loading={isLoading}
        density={'compact'} 
        filterMode={'server'}
        columns={pgns[0] ? Object.keys(pgns[0]).map(key => ({field: key})): []}></DataGrid>
    </>
  );
}

// .input(z.object({
//   skip: z.number().min(0),
//   take: z.number().min(1).max(100),
//   filters: z.object({
//     white: z.object({
//       operator: z.string(),
//       value: z.string().nullish()
//     }).nullish()
//   })
// }))