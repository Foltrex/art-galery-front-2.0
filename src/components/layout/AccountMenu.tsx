import {Login, Logout, Mail} from '@mui/icons-material';
import {
	Avatar,
	Badge,
	CircularProgress,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip
} from '@mui/material';
import * as React from 'react';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
// import {useCountProposalsByAccountId} from '../../api/ProposalApi';
import {AuthService} from '../../services/AuthService';
import LetterAvatar from '../ui/LetterAvatar';
import {useRootStore} from "../../stores/provider/RootStoreProvider";

interface IAccountMenuProps {
}

const AccountMenu: React.FunctionComponent<IAccountMenuProps> = () => {
	const [cookies] = useCookies(['token']);
	const [isLogin] = React.useState<boolean | null>(cookies.token);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const openAccountMenu = !!anchorEl;


	const {authStore} = useRootStore();
	const account = authStore.account;
    // const { data: proposalsCount } = useCountProposalsByAccountId(accountId);

	const navigate = useNavigate();

	const handleAccountButtonClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}

	const handleProfileClick = () => {
		handleClose();
		navigate('/');
	}

	const handleClose = () => {
		setAnchorEl(null);
	}


	const renderLoginMenuItem = () => {
		if (isLogin === null) {
			return (
				<CircularProgress color="success" />
			)
		} else if (isLogin) {
			return (
				<MenuItem
					onClick={() => {
						AuthService.logout(authStore, navigate)
					}}
				>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			);
		} else {
			return (
				<MenuItem
					onClick={() => {
						navigate('/auth/signin');
						handleClose();
					}}
				>
					<ListItemIcon>
						<Login fontSize='small' />
					</ListItemIcon>
					Login
				</MenuItem>
			);
		}
	}

	return (
		<>
			<Tooltip title='Account'>
				<IconButton
					size='small'
					onClick={handleAccountButtonClick}
				>
					<LetterAvatar account={account} sx={{ width: 32, height: 32 }} />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				open={openAccountMenu}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={handleProfileClick}>
					<Avatar /> Profile
				</MenuItem>
				<Divider />

				<MenuItem onClick={() => navigate('/proposals')}>
					<ListItemIcon>
						<Badge 
							// badgeContent={proposalsCount} 
							color='error'
						>
							<Mail fontSize='small' />
						</Badge>
					</ListItemIcon>

					Proposals
				</MenuItem>

				{renderLoginMenuItem()}
			</Menu>
		</>
	);
};

export default AccountMenu;
