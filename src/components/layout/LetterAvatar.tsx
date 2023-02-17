import { Avatar, SxProps, Theme } from '@mui/material';
import * as React from 'react';

interface ILetterAvatarProps {
	name: string;
	sx?: SxProps<Theme>;
}

const LetterAvatar: React.FunctionComponent<ILetterAvatarProps> = ({name, sx}) => {
	const stringToColor = (string: string) => {
		let hash = 0;
		let i;

		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}

		return color;
	}

	const stringAvatar = (name: string) => {
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: name[0].toUpperCase(),
		};
	}

	return <Avatar {...stringAvatar(name)} sx={sx} />;
};

export default LetterAvatar;
