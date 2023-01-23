import { Toolbar, IconButton, Typography, styled, useTheme, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar";
import * as React from 'react';
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({theme, open}) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

interface ITopbarProps {
    sidebarOpen: boolean;
    onSidebarButtonClick: () => void;
}

const Topbar: React.FunctionComponent<ITopbarProps> = ({sidebarOpen, onSidebarButtonClick}) => {
    const [isLogin] = React.useState<boolean | null>(null)

    const renderButton = () => {
        if (isLogin === null) {
            return (
                <CircularProgress color="success"/>
            )
        } else if (isLogin) {
            return (
                <Button
                    color="inherit"
                    variant="outlined"
                    onClick={() => {
                        // AuthService.logout()
                        console.log('Clicked');
                        
                    }}
                >
                    Logout
                </Button>
            )
        } else {
            return (
                <Button
                    color="inherit"
                    variant="outlined"
                    component={Link}
                    to={'/auth/signin'}
                >
                    Login
                </Button>
            )
        }
    }

    return (
        <AppBar position="fixed" open={sidebarOpen}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onSidebarButtonClick}
                    edge="start"
                    sx={{mr: 2, ...(sidebarOpen && {display: 'none'})}}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    // component={Link}
                    // to='/'
                    color='white'
                    sx={{flexGrow: 1, textDecoration: 'none'}}
                >
                    Admin
                </Typography>
                {renderButton()}
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
