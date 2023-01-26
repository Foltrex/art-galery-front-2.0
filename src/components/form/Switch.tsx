import { FormControlLabel, Switch as MuiSwitch } from '@mui/material';
import * as React from 'react';

interface ISwtichProps {
	name: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
	defaultChecked?: boolean | undefined;
}

const Switch: React.FunctionComponent<ISwtichProps> = ({name, onChange, defaultChecked}) => {
	const nameFirstLetter = name.charAt(0);
	const capitalizedNameFirstLetter = nameFirstLetter.toUpperCase() + name.slice(1);

	return (
		<FormControlLabel 
		control={
			<MuiSwitch 
				name={name}
				onChange={onChange} 
				defaultChecked={defaultChecked} />
		} 
		label={capitalizedNameFirstLetter}
		sx={{ mt: 1 }} />
  );
};

export default Switch;
