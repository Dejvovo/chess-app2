/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataGrid, type GridFilterModel, type GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import {Table, Pagination, Layout, Form, Input, Button, Drawer, TableProps} from 'antd';
const { Header, Footer, Sider, Content } = Layout;


const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#000',
  backgroundColor: '#fff',
};

export default function Home() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 5});
  const [filterModel, setFilterModel] = useState<GridFilterModel>({items: []});
  const [activeGame, setActiveGame] = useState<string | undefined>(undefined);

  type TableColumn = { dataIndex: string, title: string, width?: string, render?: (_: any, data: any) => React.JSX.Element };
  const whiteColumn: TableColumn = {title: 'Bily', dataIndex: 'white', width: '20%'};
  const blackColumn: TableColumn = {title: 'Cerny', dataIndex: 'black', width: '20%'};
  const resultColumn: TableColumn = {title: 'Vysledek', dataIndex: 'result'};
  const linkColumn: TableColumn = {title: 'Přehrát', dataIndex: 'pgn', width: '15%', render: (_, data) =>  (<><Button disabled={data.result.length > 10} onClick={() => setActiveGame(data.pgn)}>Přehrát</Button></>) };

  const { data, isLoading } = api.db.infinitePgns.useQuery({pagination: paginationModel, filter: filterModel});

  const onPaginationChange = (page: number, pageSize: number) => setPaginationModel({page: page -1, pageSize}) 
  const onFormFinish = (data: {name: string}) => {
    setFilterModel((prev) => {
      return {items: [{field: 'white', value: data.name, operator: 'OR' }, {field: 'black', value: data.name, operator: 'OR' }]} 
    });
  };  

  // useEffect(() => {
  //   // setRowCount((prev) => data?.count ? data.count : prev);
  //   // setRows((prev) => data?.result ? data.result : prev);
  // }, [data?.count, data?.result]);

  return (
    <>
    <Layout>
      <Sider style={siderStyle} width={'25%'}>
        <Form onFinish={onFormFinish}>
          <Form.Item label={'Jméno hráče'} name={'name'}>
            <Input/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit"> Vyhledat</Button>
    </Form.Item>
        </Form>
      </Sider>
      <Content>
        <Table 
          loading={isLoading}
          columns={[whiteColumn, blackColumn, resultColumn, linkColumn]} 
          dataSource={data?.result}
          pagination={false}
          >
          </Table>
        <Pagination total={data?.count} pageSize={paginationModel.pageSize}  current={paginationModel.page + 1} onChange={onPaginationChange}></Pagination>

        <Drawer placement="right" open={activeGame !== undefined} closable={true} onClose={() => setActiveGame(undefined)} width={'80%'}>
        <iframe title={"ad"}
                style={{ width: '100%', height: '80%' }}
                srcDoc={`<html><head>   <link rel="stylesheet" type="text/css" href="https://pgn.chessbase.com/CBReplay.css" />
        <script src="https://pgn.chessbase.com/jquery-3.0.0.min.js"></script>
    <script src="https://pgn.chessbase.com/cbreplay.js" type="text/javascript"></script>
  </head><body><div class="cbreplay">${activeGame || ''}</div></body></html>`}></iframe> 
        </Drawer>
      </Content>
    </Layout>

    </>
  );
}