import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import React, { PropsWithChildren } from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


const Layout: React.FC<PropsWithChildren> = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Topbar 
                sidebarOpen={sidebarOpen} 
                onSidebarButtonClick={() => setSidebarOpen(true)}
            /> 
            <Sidebar 
                sidebarOpen={sidebarOpen} 
                onSidebarButtonClick={() => setSidebarOpen(false)} 
            />
            
            <MainContent sidebarOpen={sidebarOpen} />
        </Box>
    );
};


export default Layout;
