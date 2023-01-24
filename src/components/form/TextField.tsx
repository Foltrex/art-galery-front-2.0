import { BaseTextFieldProps, TextField as MuiTextField } from '@mui/material';
import * as React from 'react';

interface ITestFieldProps {
	name: string;
	onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	defaultValue: any;
}

const TestField: React.FunctionComponent<ITestFieldProps> = ({ name, onChange, defaultValue }) => {
	const nameFirstLetter = name.charAt(0);
	const capitalizedNameFirstLetter = nameFirstLetter.toUpperCase() + name.slice(1);

	return (
		<MuiTextField
			autoFocus
			id={name}
			name={name}
			label={capitalizedNameFirstLetter}
			onChange={onChange}
			type="name"
			fullWidth
			required
			defaultValue={defaultValue}
			variant="standard"
		/>
	);
};

export default TestField;
