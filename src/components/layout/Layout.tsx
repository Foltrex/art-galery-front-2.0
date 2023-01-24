import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import React, { PropsWithChildren } from "react";
import MainContent from "./main-content/MainContent";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";


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
