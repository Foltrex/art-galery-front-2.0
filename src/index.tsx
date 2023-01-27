import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RootStoreProvider} from "./stores/provider/RootStoreProvider";
import { createTheme, ThemeProvider } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const defaultMaterialTheme = createTheme();
const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <RootStoreProvider>
                    <ThemeProvider theme={defaultMaterialTheme}>
                        <App/>
                    </ThemeProvider>
                </RootStoreProvider>
            </QueryClientProvider>
        </CookiesProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
