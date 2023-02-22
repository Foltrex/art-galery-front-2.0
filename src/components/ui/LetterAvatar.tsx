import { Avatar, SxProps, Theme } from '@mui/material';
import { bgcolor } from '@mui/system';
import * as React from 'react';

interface ILetterAvatarProps {
	name: string;
	sx?: SxProps<Theme>;
}

const LetterAvatar: React.FunctionComponent<ILetterAvatarProps> = ({name, sx}) => {
	const stringToColor = (string?: string) => {
		if (!string) {
			return '#e0e0e0';
		}

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

	return (
		<Avatar
			sx={{...sx, bgcolor: stringToColor(name)}} 
		>
			{name && name.at(0)
				? name[0].toUpperCase()
				: '?'
			}
		</Avatar>
	);
};

export default LetterAvatar;
