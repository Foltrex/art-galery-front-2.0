import { styled } from '@mui/styles';
import * as React from 'react';
import { FilterElement } from './Filter';

interface IRadioButtonListItemProps {
	element: FilterElement;
}

const StyledListItem = styled('li')({
	marginTop: 10,
	transition: 'all 0.5s'
})

const RadioButtonListItem: React.FunctionComponent<IRadioButtonListItemProps> = ({ element }) => {
	return (
		<StyledListItem>
			<input id={element.value} type='radio' name='style' value={element.value} />
			<label htmlFor={element.value}>{element.label}</label>
		</StyledListItem>
	);
};

export default RadioButtonListItem;
