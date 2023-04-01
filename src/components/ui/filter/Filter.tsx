import { Box, Paper } from '@mui/material';
import * as React from 'react';
import FilterList from './FilterList';
import FilterOpenButton from './FilterOpenButton';

export interface FilterElement {
    label: string;
    value: string;
}

export type FilterVariant = 'checkbox' | 'radio';

interface IFilterProps {
    title: string
    variant: FilterVariant;
    content: FilterElement[];
    size?: 'small' | 'medium' | 'large';
    style?: React.CSSProperties;
}


const Filter: React.FunctionComponent<IFilterProps> = ({
    title,
    variant = 'checkbox',
    content,
    size = 'medium',
    style
}) => {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const filterListMaxHeight = filterOpen ? 'max-content' : '0';

    var filterWidth;
    if (size === 'small') {
        filterWidth = '25%';
    } else if (size === 'medium') {
        filterWidth = '33%';
    } else {
        filterWidth = '50%';
    }

    return (
        <Paper elevation={0} sx={{ width: filterWidth, ...style, position: 'relative' }}>
            <FilterOpenButton
                filterOpen={filterOpen}
                onClick={() => setFilterOpen(!filterOpen)}
                title={title}
            />

            <FilterList
                content={content}
                style={{ maxHeight: filterListMaxHeight }}
                variant={variant}
            />
        </Paper >
    );
};

export default Filter;
