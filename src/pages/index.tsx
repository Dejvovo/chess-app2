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
  const emptyPgn = (id: number): (typeof pgns)[0] => ({black: '', blackElo: 0, date: null, eco: '', event: '',eventDate: null, id: id, moves: '', pgn: '', plyCount: null, result: '', round: '', site: '', sourceDate: null,sourceUrl: null, white: '', whiteElo: null});
  const emptyPgns = () => [...Array(25).keys()].map(k => emptyPgn(k));

  const [rowCount, setRowCount] = useState<number>();
  const [rows, setRows] = useState<typeof pgns>(emptyPgns());

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 25});
  const [filterModel, setFilterModel] = useState<GridFilterModel>({items: []});

  const { data, isLoading } = api.db.infinitePgns.useQuery({pagination: paginationModel, filter: filterModel});

  const pgns = data?.result || [];
  
  useEffect(() => {
    setRowCount((prev) => data?.count ? data.count : prev);
    setRows((prev) => data?.result ? data.result : prev);
  }, [data?.count, data?.result]);

  return (
    <>

      <DataGrid 
        loading={isLoading}
        density={'compact'} 

        rows={rows} 
        rowCount={rowCount}

        paginationMode={'server'}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {setPaginationModel(model)}}
        
      
        filterMode={'server'}
        filterModel={filterModel}
        onFilterModelChange={(model) => {model.items.length != 0 ? setFilterModel(model) : undefined;}}
        columns={pgns[0] ? Object.keys(pgns[0]).map(key => ({field: key})): []}></DataGrid>
    </>
  );
}