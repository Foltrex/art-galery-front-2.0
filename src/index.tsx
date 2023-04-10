import {createTheme, ThemeProvider} from '@mui/material';
import React from 'react';
import {CookiesProvider} from 'react-cookie';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from 'react-query';
import App from './App';
import ErrorBoundary from './components/error/ErrorBoundary';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {RootStoreProvider} from "./stores/provider/RootStoreProvider";
import Bubble from "./components/bubble/Bubble";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const defaultMaterialTheme = createTheme();
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
}});

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <CookiesProvider>
                <QueryClientProvider client={queryClient}>
                    <RootStoreProvider>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <App />
                            </LocalizationProvider>
                        </ThemeProvider>
                    </RootStoreProvider>
                </QueryClientProvider>
            </CookiesProvider>
            <Bubble />
        </ErrorBoundary>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
