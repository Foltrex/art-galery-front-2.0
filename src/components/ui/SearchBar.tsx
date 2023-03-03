import { Autocomplete, Box, IconButton, InputBase, Paper, SxProps, TextField, Theme } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, useState } from "react";
import { Container } from "@mui/system";

interface ISearchBarProps {
    sx?: SxProps<Theme>;
    onSearch: (text: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({ sx, onSearch }) => {
    const [searcingText, setSearchingText] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchingText(text);
    }

    return (
        <Container>
            <Paper sx={{...sx, display: 'flex', alignItems: 'center'}}>
                <InputBase 
                    sx={{ flexGrow: 1, pl: 2 }} 
                    placeholder='Search Paintings...' 
                    inputProps={{ 'aria-label': 'search paintings' }}
                    onChange={handleChange} 
                />
                <IconButton aria-label='search' onClick={() => onSearch(searcingText)}>
                    <SearchIcon />
                </IconButton>
            </Paper>
        </Container>
    );
}

export default SearchBar;