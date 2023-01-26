import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent, SxProps, Theme } from '@mui/material';
import * as React from 'react';

type SelectItem = {id: string};

interface ISelectProps<T extends SelectItem> {
	name: string;
	label?: string;
	selected?: T;
	options: T[];
	onChange: (event: SelectChangeEvent<string>, data: T) => void;
	mapToSelectMenuItemElement: (item: T) => string;
	sx?: SxProps<Theme> | undefined;
	fullWidth?: boolean | undefined;
}

function Select<T extends SelectItem>({ 
	name, 
	label,
	selected, 
	options, 
	onChange, 
	mapToSelectMenuItemElement,
	sx,
	fullWidth
}: ISelectProps<T>) {
	const labelString = label ?? name;
	const nameFirstLetter = (labelString).charAt(0);
	const capitalizedNameFirstLetter = nameFirstLetter.toUpperCase() + labelString.slice(1);

	const handleChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
		const selectedId = event.target.value;
		const selected = options.find(option => option.id === selectedId);
		onChange(event, selected!);
	}

	return (
		<FormControl fullWidth={fullWidth} sx={sx} size='small'>
			<InputLabel id={`${name}-label`}>{capitalizedNameFirstLetter}</InputLabel>
			<MuiSelect
				labelId={`${name}-label`}
				id={name}
				name={name}
				label={capitalizedNameFirstLetter}
				defaultValue={selected?.id}
				required
				onChange={handleChange}
			>
				{options?.map(option => (
					<MenuItem key={option.id} value={option.id}>
						{mapToSelectMenuItemElement(option)}
					</MenuItem>
				))}
			</MuiSelect>
		</FormControl>
	);
};

export default Select;
