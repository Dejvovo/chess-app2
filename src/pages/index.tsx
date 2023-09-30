/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataGrid, type GridFilterModel, type GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import {
  Table,
  Pagination,
  Layout,
  Form,
  Input,
  Button,
  Drawer,
  TableProps,
  theme,
  Menu,
  type MenuProps,
  Empty, Skeleton
} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import {Mobile} from "~/pages/Mobile";
import {FilterForm} from "~/pages/components/FilterForm";
import {LoadingCenter} from "~/pages/components/LoadingCenter";
import {LoadingSkeleton} from "~/pages/components/LoadingSkeleton";



const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#000',
  backgroundColor: '#fff',
};

const gameIframe = (pgn?: string ) => `<html><head>   <link rel="stylesheet" type="text/css" href="https://pgn.chessbase.com/CBReplay.css" />
<script src="https://pgn.chessbase.com/jquery-3.0.0.min.js"></script>
<script src="https://pgn.chessbase.com/cbreplay.js" type="text/javascript"></script>
</head><body><div class="cbreplay">${pgn || ''}</div></body></html>`;

export default function Home() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10});
  const [filterModel, setFilterModel] = useState<GridFilterModel>({items: []});
  const [activeGame, setActiveGame] = useState<string | undefined>(undefined);
  const [isMobile, setMobile] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    if(window.innerWidth < 700){
      setMobile(true);
    }
    setPageLoading(false);
  }, [])

  type TableColumn = { dataIndex: string, title: string, width?: string, render?: (_: any, data: any) => React.JSX.Element };
  const whiteColumn: TableColumn = {title: 'Bílý', dataIndex: 'white', width: '20%'};
  const blackColumn: TableColumn = {title: 'Černý', dataIndex: 'black', width: '20%'};
  const resultColumn: TableColumn = {title: 'Výsledek', dataIndex: 'result', width: '5%', render: (_, data) => <>{data?.result.length > 10 ? (data?.result as string).substring(0, 10) + '...' : data?.result }</>};
  const dateColumn: TableColumn = {title: 'Datum', dataIndex: 'date', width: '15%', render: (_, data) => <>{data?.date?.toLocaleString()}</>};
  const linkColumn: TableColumn = {title: 'Přehrát', dataIndex: 'pgn', width: '15%', render: (_, data) =>  (<><Button disabled={data.result.length > 10} onClick={() => setActiveGame(data.pgn)}>Přehrát</Button></>) };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { data, isLoading } = api.db.infinitePgns.useQuery({pagination: paginationModel, filter: filterModel});
  const onPaginationChange = (page: number, pageSize: number) => setPaginationModel({page: page -1, pageSize}) 
  const onFormFinish = (data: {name: string}) => {
    setFilterModel((_) => {
      return {items: [{field: 'white', value: data.name, operator: 'OR' }, {field: 'black', value: data.name, operator: 'OR' }]} 
    });
  };


type MenuItem = Required<MenuProps>['items'][number];

  const getItem = (label: React.ReactNode, key: React.Key, type?: 'group'): MenuItem => ({ key, label, type })

  if(pageLoading){
    return <LoadingCenter/>
  }

  if(isMobile){
    return (
        <div>
      {isLoading
          ? <div style={{textAlign: "center", marginTop: '10px'}}>
              <Skeleton.Input active/>
              <LoadingSkeleton/>
            </div>
          : <Mobile onFormFinish={onFormFinish} data={data?.result ??  []}/>}
      {!!data?.count
          ? <div style={{position: "fixed", bottom: 0, backgroundColor: "white", width: '100vw', padding: '10px 0', textAlign: 'center'}}><Pagination size={'small'} total={data?.count} pageSize={paginationModel.pageSize}  current={paginationModel.page + 1} onChange={onPaginationChange}></Pagination></div>
          : <Empty/>
      }
    </div>)
  }

  return (
    <>
    <Layout>
      <Sider style={{ background: colorBgContainer }} width={'200px'}>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        items={[getItem('Přehled her', '1')]} //, getItem('Přehled týmů', '2')
      />
      </Sider>
      <Content  style={{ padding: '20px', minHeight: 280 }}>
        <FilterForm onFormFinish={onFormFinish} />
        <Table 
          loading={isLoading}
          columns={[whiteColumn, blackColumn, resultColumn, dateColumn, linkColumn]} 
          dataSource={data?.result}
          pagination={false}
          size={'small'}
          >
          </Table>
        <Pagination total={data?.count} pageSize={paginationModel.pageSize}  current={paginationModel.page + 1} onChange={onPaginationChange}></Pagination>

        <Drawer placement="right" open={activeGame !== undefined} closable={true} onClose={() => setActiveGame(undefined)} width={'80%'}>
        <iframe title={"ad"}
                style={{ width: '100%', height: '100%' }}
                srcDoc={gameIframe(activeGame)}></iframe> 
        </Drawer>
      </Content>
    </Layout>

    </>
  );
}