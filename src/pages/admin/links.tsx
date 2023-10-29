/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button, DatePicker, Drawer, Form } from 'antd';
import { useSnackbar } from "notistack";
import { useState } from 'react';
import { api } from "~/utils/api";

const Links = ()=>  {
    const [drawer, setDrawer] = useState<string | undefined>();
    const { enqueueSnackbar } = useSnackbar();
    // const refreshAllLinks = api.chesscz.refreshAllLinks.useQuery(undefined);
    // const refreshAllGroups = api.chesscz.refreshAllGroups.useQuery(undefined);

    const storeGamesFromLinks = api.games.storeGamesFromLinks.useMutation();
    
    const refreshLinksInDb = () => {
        enqueueSnackbar('Linky v DB se nyní přegenerují, tato akce chvíli potrvá. Mačkejte mezitím f5');
        // refreshAllLinks.refetch();
    }

    const refreshGroupsInDb = () => {
        enqueueSnackbar('Nyní se přegenerují všechny oddíly v DB');
        // refreshAllGroups.refetch();
    }

    const handleStoreGamesFromLinks = <T extends {interval: [string, string]}>(input: T) => {
        enqueueSnackbar('Partie se nyní nahrávají do DB mačkejte mezitím f5');
        storeGamesFromLinks.mutate({from: new Date(input.interval[0]), to: new Date(input.interval[1])});
    }

    return <>
            {/* <Button onClick={refreshLinksInDb}>Přegenerovat linky v DB</Button>
            <Button onClick={refreshGroupsInDb}>Přegenerovat oddíly v DB</Button> */}
            <Button onClick={() => setDrawer("intervalLinks")}>Nasypat hry z linku do DB</Button>
            <Drawer open={drawer === "intervalLinks"} closable={true} onClose={() => setDrawer(undefined)}>
                <Form onFinish={handleStoreGamesFromLinks}>
                    <Form.Item name={"interval"}>
                        <DatePicker.RangePicker>
                        </DatePicker.RangePicker>
                    </Form.Item>
                    <Button htmlType='submit'>Potvrdit</Button>
                </Form>
            </Drawer>
        </>
}


export default Links;
