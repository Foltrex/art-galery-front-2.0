import { Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import * as React from 'react';

interface ILoadMoreButtonProps {
	onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const LoadMoreButton: React.FunctionComponent<ILoadMoreButtonProps> = ({ onClick }) => {
	return (
		<Button
			startIcon={<ArrowDownwardIcon />}
			variant='contained'
			sx={{
				position: 'absolute',
				bottom: '0',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				borderRadius: 8
			}}
			onClick={onClick}
		>
			Load More
		</Button>
	);
};

export default LoadMoreButton;
