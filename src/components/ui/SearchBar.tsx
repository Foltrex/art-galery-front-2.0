import {IconButton, InputBase, Paper, SxProps, Theme} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import {ChangeEvent, useState} from "react";
import {Container} from "@mui/system";

interface ISearchBarProps {
    sx?: SxProps<Theme>;
    onSearch: (text: string) => void;
    placeholder: string;
}

const SearchBar: React.FC<ISearchBarProps> = ({ sx, onSearch, placeholder }) => {
    const [searchingText, setSearchingText] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchingText(text);
    }

    return (
        <Container>
            <Paper sx={{...sx, display: 'flex', alignItems: 'center'}}>
                <InputBase 
                    sx={{ flexGrow: 1, pl: 2 }} 
                    placeholder={placeholder} 
                    inputProps={{ 'aria-label': placeholder }}
                    onChange={handleChange} 
                />
                <IconButton aria-label='search' onClick={() => onSearch(searchingText)}>
                    <SearchIcon />
                </IconButton>
            </Paper>
        </Container>
    );
}

export default SearchBar;
