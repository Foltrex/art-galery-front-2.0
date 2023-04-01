import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LocalPostOfficeOutlined from '@mui/icons-material/LocalPostOfficeOutlined';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutline from '@mui/icons-material/PeopleOutline';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import {Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {Link} from 'react-router-dom';
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {Account} from "../../entities/account";
import {find} from "../../util/MetadataUtil";

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

function prepareSidebar(account:Account) {
    switch (account.accountType) {
        case AccountEnum.REPRESENTATIVE:
            return [
                {
                    text: 'Organization',
                    icon: <AccountCircleOutlinedIcon/>,
                    link: '/organization/' + find('organizationId', account)
                },
                {
                    text: 'Catalog',
                    icon: <PhotoSizeSelectActualOutlinedIcon />,
                    link: '/arts/representative'
                },
                {
                    text: 'Representatives',
                    icon: <PeopleIcon />,
                    link: '/representatives?page=0&limit=10'
                },
                {
                    text: 'Facilities',
                    icon: <HomeWorkOutlinedIcon/>,
                    link: '/facilities?page=0&limit=10'
                }
            ];
        case AccountEnum.ARTIST:
            return [
                {
                    text: 'Artist',
                    icon: <AccountCircleOutlinedIcon/>,
                    link: '/' + account.id
                },
                {
                    text: 'Arts',
                    icon: <PhotoSizeSelectActualOutlinedIcon />,
                    link: '/arts/artist'
                },
                {
                    text: 'Organizations',
                    icon: <PeopleIcon />,
                    link: '/organizations'
                }
            ]
        case AccountEnum.SYSTEM: {
            return [
                {
                    text: 'Artists',
                    icon: <PeopleOutline/>,
                    link: '/artists?page=0&limit=10'
                },
                {
                    text: 'Organizations',
                    icon: <LocalPostOfficeOutlined/>,
                    link: '/organizations'
                }
            ]
        }
        default:
            return [{
                text: 'Application error, please login again',
                icon: <LoginOutlined/>,
                link: '/'
            }];
    }
}
const Sidebar: React.FC<ISidebarProps> = ({sidebarOpen, onSidebarButtonClick}) => {
    const theme = useTheme();
    const {authStore} = useRootStore();
    const account = authStore.account;
    if(!account) {
        return null;
    }

    const sidebar = prepareSidebar(account);

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
                {sidebar.map(sidebarElement => {
                    return (
                        <ListItem key={sidebarElement.text}
                                  component={Link}
                                  style={{color: "black"}}
                                  to={sidebarElement.link}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    {sidebarElement.icon}
                                </ListItemIcon>
                                <ListItemText primary={sidebarElement.text}/>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default Sidebar;
