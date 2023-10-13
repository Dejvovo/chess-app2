import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { csCZ as materialCsCz} from '@mui/material/locale';
import {  csCZ as dataGridCsCz} from '@mui/x-data-grid';
import { SnackbarProvider } from 'notistack';
import { Analytics } from '@vercel/analytics/react';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  materialCsCz,
  dataGridCsCz
);

const MyApp: AppType = ({ Component, pageProps }) => {
  return <ThemeProvider theme={theme}><SnackbarProvider><Component {...pageProps} /><Analytics /></SnackbarProvider></ThemeProvider>;
};

export default api.withTRPC(MyApp);
