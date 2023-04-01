
import * as React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, styled } from '@mui/material';

interface IFilterOpenButtonProps {
    filterOpen: boolean;
    onClick: () => void;
    title: string;
}

const StyledTitle = styled(Button)({
    color: 'black',
    width: '100%',
    backgroundColor: 'rgb(248, 249, 250)',
    display: 'flex',
    justifyContent: 'space-between',
    height: '40px'
});

const FilterOpenButton: React.FunctionComponent<IFilterOpenButtonProps> = ({filterOpen, onClick, title}) => {
    return (
        <StyledTitle
            disableTouchRipple
            disableRipple
            onClick={onClick}
            endIcon={filterOpen
                ? <KeyboardArrowUpIcon />
                : <KeyboardArrowDownIcon />
            }>
            {title}
        </StyledTitle>
    );
};

export default FilterOpenButton;
