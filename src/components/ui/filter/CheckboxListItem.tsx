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
        <input id={element.value} type='checkbox' name='style' value={element.value} />
        <label htmlFor={element.value}>{element.label}</label>
    </StyledListItem>
  );
};

export default CheckboxListItem;
