import {IconButton, InputBase, Paper, SxProps, Theme} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import {CSSProperties, ChangeEvent, useState} from "react";
import {Container} from "@mui/system";

interface ISearchBarProps {
    style?: CSSProperties;
    onSearch: (text: string) => void;
    placeholder: string;
    width?: string;
}

const SearchBar: React.FC<ISearchBarProps> = ({ style, onSearch, placeholder, width }) => {
    const [searchingText, setSearchingText] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchingText(text);
    }

    return (
        <Container style={{ ...style }}>
            <Paper sx={{ display: 'flex', alignItems: 'center'}}>
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
