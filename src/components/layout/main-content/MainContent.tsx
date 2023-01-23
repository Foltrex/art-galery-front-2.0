import * as React from 'react';
import { styled } from "@mui/material/styles";

const drawerWidth = 240;

const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    })
}));

const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
}));


interface IMainContent {
    children?: React.ReactNode;
    sidebarOpen: boolean;
}

const MainContent: React.FunctionComponent<IMainContent> = ({children, sidebarOpen}) => {
  return (
    <Main open={sidebarOpen}>
        <DrawerHeader/>
        {children}
    </Main>
  );
};

export default MainContent;
