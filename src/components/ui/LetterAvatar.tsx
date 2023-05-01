import {Avatar, SxProps, Theme} from '@mui/material';
import * as React from 'react';
import {useMemo} from 'react';
import {Account} from "../../entities/account";
import {find} from "../../util/MetadataUtil";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {buildImageUrl} from "../../util/PrepareDataUtil";

interface ILetterAvatarProps {
	account?: Account;
	sx?: SxProps<Theme>;
}

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

const LetterAvatar: React.FunctionComponent<ILetterAvatarProps> = ({account, sx }) => {
	const name = useMemo(() => (account?.firstName) + " " + (account?.lastName || ""), [account]);
	const color = useMemo(() => stringToColor(name), [name]);
	const src = useMemo(() => {
		if(!account) {
			return undefined;
		}
		const image = find(MetadataEnum.ACCOUNT_IMAGE, account);
		return image ? buildImageUrl(image) : undefined;
	}, [account])

	return (
		<Avatar
			src={src}
			sx={{ ...sx, bgcolor: color }}
		>
			{
				name && name[0].toUpperCase()
			}
		</Avatar>
	);
};

export default LetterAvatar;
