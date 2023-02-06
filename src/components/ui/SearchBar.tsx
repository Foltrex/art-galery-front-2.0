import { Autocomplete, Box, IconButton, InputBase, Paper, SxProps, TextField, Theme } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';

interface ISearchBarProps {
    sx: SxProps<Theme>;
}

const SearchBar: React.FC<ISearchBarProps> = ({ sx }) => {
    return (
        <Paper sx={{...sx, display: 'flex', alignItems: 'center'}}>
            <InputBase 
                sx={{ flexGrow: 1, pl: 2 }} 
                placeholder='Search Paintings' 
                inputProps={{ 'aria-label': 'search paintings' }} 
            />
            <IconButton aria-label='search'>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

export default SearchBar;