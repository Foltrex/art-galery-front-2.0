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
import {find, isCreatorOrAdmin} from "../../util/MetadataUtil";
import {observer} from "mobx-react";

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
    console.log(account);
    switch (account.accountType) {
        case AccountEnum.REPRESENTATIVE: {
            const result = [];
            const admin = isCreatorOrAdmin(account);
            console.log(admin, account)
            if(admin) {
                result.push({
                    text: 'Organization',
                    icon: <AccountCircleOutlinedIcon/>,
                    link: '/organizations/' + find('organizationId', account)
                });
                result.push({
                    text: 'Facilities',
                    icon: <HomeWorkOutlinedIcon/>,
                    link: '/facilities'
                });
                result.push({
                    text: 'Users',
                    icon: <PeopleIcon/>,
                    link: '/users'
                });
            } else {
                result.push({
                    text: 'Facility',
                    icon: <HomeWorkOutlinedIcon/>,
                    link: '/facilities/' + find("facilityId", account)
                });
            }
            result.push({
                text: 'Gallery',
                icon: <PhotoSizeSelectActualOutlinedIcon/>,
                link: '/gallery'
            })
            result.push({
                text: 'Account',
                icon: <AccountCircleOutlinedIcon/>,
                link: '/account/' + account.id
            })
            return result;
        }
        case AccountEnum.ARTIST:
            return [
                {
                    text: 'Organizations',
                    icon: <PeopleIcon />,
                    link: '/organizations'
                },
                {
                    text: 'Facilities',
                    icon: <LocalPostOfficeOutlined/>,
                    link: '/facilities'
                },
                {
                    text: 'Gallery',
                    icon: <PeopleOutline/>,
                    link: '/gallery'
                },
                {
                    text: 'Account',
                    icon: <AccountCircleOutlinedIcon/>,
                    link: '/account/' + account.id
                },
            ]
        case AccountEnum.SYSTEM: {
            return [
                {
                    text: 'Organizations',
                    icon: <LocalPostOfficeOutlined/>,
                    link: '/organizations'
                },
                {
                    text: 'Facilities',
                    icon: <LocalPostOfficeOutlined/>,
                    link: '/facilities'
                },
                {
                    text: 'Users',
                    icon: <PeopleOutline/>,
                    link: '/users'
                },
                {
                    text: 'Gallery',
                    icon: <PeopleOutline/>,
                    link: '/gallery'
                },
                {
                    text: 'Account',
                    icon: <PeopleOutline/>,
                    link: '/account/' + account.id
                },
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
const Sidebar: React.FC<ISidebarProps> = observer(({sidebarOpen, onSidebarButtonClick}) => {
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
});

export default Sidebar;
