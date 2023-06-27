/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from "notistack";
import { api } from "~/utils/api";

const defaultColumns = (objects: object[]) => objects[0] ? Object.keys(objects[0]).map(key => ({field: key})) : [];

const Links = ()=>  {
    const { enqueueSnackbar } = useSnackbar();
    const refreshAllLinks = api.chesscz.refreshAllLinks.useQuery(undefined, {enabled: false});
    const saveGamesFromUrl = api.chesscz.saveGamesFromUrl.useMutation();
    
    const refreshLinksInDb = () => {
        enqueueSnackbar('Linky v DB se nyní přegenerují, tato akce chvíli potrvá. Mačkejte mezitím f5');
        refreshAllLinks.refetch();
    }
    const links = api.chesscz.links.useQuery().data || [];

    return <>
        <Button variant={'contained'} onClick={refreshLinksInDb}>Přegenerovat linky v DB</Button>
        <Table size={'small'}>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Zdrojová URL
                    </TableCell>
                    <TableCell>
                        Jsou hry správně naparsované?
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {links.map(link => ( 
                <TableRow key={link.url}>
                    <TableCell>
                        {link.url}
                    </TableCell>
                    <TableCell>
                        {link.isParsed ? 'ANO' : 'NE'}
                    </TableCell>
                    <TableCell>
                        <LoadingButton  size={'small'} variant={'contained'} disabled={saveGamesFromUrl.isLoading} onClick={() => saveGamesFromUrl.mutate({url: link.url})}>Vložit do DB</LoadingButton>
                    </TableCell>
                </TableRow>))}
            </TableBody>

        </Table>
    </>
}


export default Links;
