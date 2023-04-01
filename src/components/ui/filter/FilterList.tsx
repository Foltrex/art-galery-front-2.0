
import { styled } from '@mui/material';
import * as React from 'react';
import CheckboxListItem from './CheckboxListItem';
import { FilterElement, FilterVariant } from './Filter';
import RadioButtonListItem from './RadioButtonListItem';

interface IFilterListProps {
    style?: React.CSSProperties;
    content: FilterElement[];
    variant: FilterVariant;
}


const StyledList = styled('ul')({
    zIndex: 4,
    listStyle: 'none',
    paddingInlineStart: 'inherit',
    margin: 'auto',
    width: '100%',
    maxHeight: 0,
    overflow: 'hidden',
});

const FilterList: React.FunctionComponent<IFilterListProps> = ({ style, content, variant }) => {
    switch (variant) {
        case 'checkbox': {
            return (
                <StyledList style={{ ...style }}>
                    {content.map(item => (
                        <CheckboxListItem key={item.value} element={item} />
                    ))}
                </StyledList>
            );
        }
        case 'radio': {
            return (
                <StyledList style={{ ...style }}>
                    {content.map(item => (
                        <RadioButtonListItem key={item.value} element={item} />
                    ))}
                </StyledList>
            );
        }
    }
};

export default FilterList;
