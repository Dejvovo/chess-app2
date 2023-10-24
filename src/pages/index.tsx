/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import {
  Table,
  Pagination,
  Layout,
  Button,
  Drawer,
  theme,
  Menu,
  type MenuProps,
  Empty, Skeleton
} from 'antd';
const { Sider, Content } = Layout;
import {Mobile} from "~/components/Mobile";
import {FilterForm} from "~/components/FilterForm";
import {LoadingCenter} from "~/components/LoadingCenter";
import {LoadingSkeleton} from "~/components/LoadingSkeleton";
import { useWindowSize } from "@uidotdev/usehooks";
import { ChessBaseIframe } from "~/components/ChessBaseIframe";

const removeAllCommas = (text: string) => text.replace(/,/g, " ");
const createFieldsForValue = (name: string) => [{field: 'white', value: name, operator: 'OR' }, {field: 'black', value: name, operator: 'OR' }]

// TODO move to backend
const getFullnameVariations = (fullname: string) => {
  // Currently there is a problem in DB data. 
  // The same player can be stored in many ways: 'Jan Novak' = 'Jan, Novak' = 'Jan,Novak' = 'Novak, Jan'
  
  // User who writes full name in the form wants to see ALL of those variations. 
  // So 'Novak Jan' input, must be transformed into all variations above. 

  const [first, last] = removeAllCommas(fullname).split(' ');
  
  if(!first) return [];

  // Only single name is inserted, no variations created.
  if(!last) {
    return createFieldsForValue(first || '');
  }

  let variations: any[] = [];
  variations = [...variations, ...createFieldsForValue(`${first} ${last}`)];
  variations = [...variations, ...createFieldsForValue(`${first},${last}`)];
  variations = [...variations, ...createFieldsForValue(`${first}, ${last}`)];

  variations = [...variations, ...createFieldsForValue(`${last} ${first}`)];
  variations = [...variations, ...createFieldsForValue(`${last},${first}`)];
  variations = [...variations, ...createFieldsForValue(`${last}, ${first}`)];
  return variations;
}

export default function Home() {
  const [paginationModel, setPaginationModel] = useState<any>({page: 0, pageSize: 10});
  const [filterModel, setFilterModel] = useState<any>({items: []});
  const [activeGame, setActiveGame] = useState<string | undefined>(undefined);
  const [isMobile, setMobile] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const size = useWindowSize();

  useEffect(() => {
    setMobile(size.width ? size.width < 700 : true);
    setPageLoading(false);
  }, [size])

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
    setFilterModel((_: any) => {
      return {items:  getFullnameVariations(data.name)} 
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
        items={[getItem('Přehled her', '1')]}
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

        <Drawer open={activeGame !== undefined} closable={true} onClose={() => setActiveGame(undefined)}>
        {activeGame && <ChessBaseIframe activeGame={activeGame}></ChessBaseIframe>}
        </Drawer>
      </Content>
    </Layout>

    </>
  );
}