import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent, SxProps, Theme } from '@mui/material';
import * as React from 'react';

type SelectItem = {id: string; name: string};

interface ISelectProps<T extends SelectItem> {
	name: string;
	selected: T;
	options: T[];
	onChange: ((event: SelectChangeEvent<any>, child: React.ReactNode) => void);
	sx?: SxProps<Theme> | undefined;
}

function Select<T extends SelectItem>({ name, selected, options, onChange, sx }: ISelectProps<T>) {
	const nameFirstLetter = name.charAt(0);
	const capitalizedNameFirstLetter = nameFirstLetter.toUpperCase() + name.slice(1);

	return (
		<FormControl sx={sx} size='small'>
			<InputLabel id={`${name}-label`}>{capitalizedNameFirstLetter}</InputLabel>
			<MuiSelect
				labelId={`${name}-label`}
				id={name}
				name={name}
				label={capitalizedNameFirstLetter}
				defaultValue={selected.id}
				required
				onChange={onChange}
			>
				{options?.map(option => (
					<MenuItem key={option.id} value={option.id}>
						{option.name}
					</MenuItem>
				))}
			</MuiSelect>
		</FormControl>
	);
};

export default Select;
