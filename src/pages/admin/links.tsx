/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button, Table } from 'antd';
import { useSnackbar } from "notistack";
import { api } from "~/utils/api";

const Links = ()=>  {
    const { enqueueSnackbar } = useSnackbar();
    const refreshAllLinks = api.chesscz.refreshAllLinks.useQuery(undefined);
    const refreshAllGroups = api.chesscz.refreshAllGroups.useQuery(undefined);

    const pushGamesFromLinksToDB = api.chesscz.pushGamesFromLinksToDB.useMutation();
    const saveGamesFromUrl = api.chesscz.saveGamesFromUrl.useMutation();
    
    const refreshLinksInDb = () => {
        enqueueSnackbar('Linky v DB se nyní přegenerují, tato akce chvíli potrvá. Mačkejte mezitím f5');
        refreshAllLinks.refetch();
    }

    const refreshGroupsInDb = () => {
        enqueueSnackbar('Nyní se přegenerují všechny oddíly v DB');
        refreshAllGroups.refetch();
    }

    const callPushGamesFromLinksToDB = () => {
        enqueueSnackbar('Partie se nyní nahrávají do DB mačkejte mezitím f5');
        pushGamesFromLinksToDB.mutate();
    }


    const links = api.chesscz.links.useQuery().data || [];

    return <>
        <Button onClick={refreshLinksInDb}>Přegenerovat linky v DB</Button>
        <Button onClick={callPushGamesFromLinksToDB}>Nasypat všechny hry z linku do DB</Button>
        <Button onClick={refreshGroupsInDb}>Přegenerovat oddíly v DB</Button>

        <br/>
                        {/* Zdrojová URL| Jsou hry správně naparsované? */}
                {/* {links.map(link => ( 
                        {link.url}
                        {link.isParsed ? 'ANO' : 'NE'}))} */}
                    </>
}


export default Links;
