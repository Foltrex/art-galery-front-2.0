import { Drawer, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
}));

interface ISidebarProps {
    sidebarOpen: boolean;
    onSidebarButtonClick: () => void;
}

const Sidebar: React.FC<ISidebarProps> = ({sidebarOpen, onSidebarButtonClick}) => {
    const theme = useTheme();

    const sideBarElements = [
        {
            text: 'Organization',
            icon: <AccountCircleOutlinedIcon/>,
            link: '/'
        },
        {
            text: 'Representatives',
            icon: <HomeWorkOutlinedIcon/>,
            link: '/representatives?page=0&limit=10'
        },
        {
            text: 'Facilities',
            icon: <PhotoSizeSelectActualOutlinedIcon/>,
            link: '/facilities?page=0&limit=10'
        }
    ];

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={sidebarOpen}
        >
            <DrawerHeader>
                <IconButton onClick={onSidebarButtonClick}>
                    {theme.direction === 'ltr' 
                        ? <ChevronLeftIcon/> 
                        : <ChevronRightIcon/>}
                </IconButton>
            </DrawerHeader>
            <Divider/>
            <List>
                {sideBarElements.map(sidebarElement => {
                    return (
                        <ListItem key={sidebarElement.text}
                                //   component={Link}
                                  style={{color: "black"}}
                                //   to={sidebarElement.link}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    {sidebarElement.icon}
                                </ListItemIcon>
                                <ListItemText primary={sidebarElement.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default Sidebar;
