/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { api } from "~/utils/api";

const Links = ()=>  {
    const { enqueueSnackbar } = useSnackbar();
    const {refetch} = api.chesscz.refreshAllLinks.useQuery(undefined, {enabled: false});

    const refreshLinksInDb = () => {
        enqueueSnackbar('Linky v DB přegenerovány, tato akce chvíli potrvá');
        refetch();
    }

    return <><Button variant={'contained'} onClick={refreshLinksInDb}>Přegenerovat linky v DB</Button></>
}


export default Links;
