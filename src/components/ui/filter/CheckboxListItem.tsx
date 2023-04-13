import { styled } from '@mui/styles';
import * as React from 'react';
import { FilterElement } from './Filter';

interface ICheckboxListItemProps {
  element: FilterElement;
}

const StyledListItem = styled('li')({
  marginTop: 10,
  transition: 'all 0.5s'
})

const CheckboxListItem: React.FunctionComponent<ICheckboxListItemProps> = ({element}) => {
  return (
    <StyledListItem>
        <input id={element.label} type='checkbox' name='style' value={element.label} />
        <label htmlFor={element.label}>{element.label}</label>
    </StyledListItem>
  );
};

export default CheckboxListItem;
