import { Drawer, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';

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
                <ListItem key={'Organization'}
                        //   component={Link}
                        style={{color: "black"}}
                        //   to='/'
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountCircleOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary='Organization'/>
                    </ListItemButton>
                </ListItem>
                <ListItem key={'Representatives'}
                        //   component={Link}
                        style={{color: "black"}}
                        //   to={'/representatives?page=0&limit=10'}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeWorkOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary='Representatives'/>
                    </ListItemButton>
                </ListItem>
                <ListItem key={'Facilities'}
                        //   component={Link}
                        style={{color: "black"}}
                        //   to={'/facilities?page=0&limit=10'}
                >

                    <ListItemButton>
                        <ListItemIcon>
                            <PhotoSizeSelectActualOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary='Facilities'/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
