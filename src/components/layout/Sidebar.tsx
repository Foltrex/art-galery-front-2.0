import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import MapsHomeWorkOutlined from '@mui/icons-material/MapsHomeWorkOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import CropOriginalOutlined from '@mui/icons-material/CropOriginalOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
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
    switch (account.accountType) {
        case AccountEnum.REPRESENTATIVE: {
            const result = [];
            const admin = isCreatorOrAdmin(account);
            if(admin) {
                result.push({
                    text: 'Organization',
                    icon: <HomeOutlined/>,
                    link: '/organizations/' + find('organizationId', account)
                });
                result.push({
                    text: 'Facilities',
                    icon: <MapsHomeWorkOutlined/>,
                    link: '/facilities'
                });
                result.push({
                    text: 'Users',
                    icon: <GroupOutlined/>,
                    link: '/users'
                });
            } else {
                result.push({
                    text: 'Facility',
                    icon: <MapsHomeWorkOutlined/>,
                    link: '/facilities/' + find("facilityId", account)
                });
            }
            result.push({
                text: 'Gallery',
                icon: <CropOriginalOutlined/>,
                link: '/gallery'
            })
            result.push({
                text: 'Account',
                icon: <AccountCircleOutlined/>,
                link: '/'
            })
            return result;
        }
        case AccountEnum.ARTIST:
            return [
                {
                    text: 'Organizations&facilities.',
                    icon: <HomeOutlined />,
                    link: '/organizations'
                },
                // {
                //     text: 'Facilities',
                //     icon: <MapsHomeWorkOutlined/>,
                //     link: '/facilities'
                // },
                {
                    text: 'Gallery',
                    icon: <CropOriginalOutlined/>,
                    link: '/gallery'
                },
                {
                    text: 'Account',
                    icon: <AccountCircleOutlined/>,
                    link: '/'
                },
            ]
        case AccountEnum.SYSTEM: {
            return [
                {
                    text: 'Organizations',
                    icon: <HomeOutlined/>,
                    link: '/organizations'
                },
                {
                    text: 'Facilities',
                    icon: <MapsHomeWorkOutlined/>,
                    link: '/facilities'
                },
                {
                    text: 'Users',
                    icon: <GroupOutlined/>,
                    link: '/users'
                },
                {
                    text: 'Gallery',
                    icon: <CropOriginalOutlined/>,
                    link: '/gallery'
                },
                {
                    text: 'Errors',
                    icon: <ErrorOutlineOutlinedIcon/>,
                    link: '/errors'
                },
                {
                    text: 'Account',
                    icon: <AccountCircleOutlined/>,
                    link: '/'
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
