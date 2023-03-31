import React, {ChangeEventHandler} from 'react';
import {FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

interface IPasswordTextFieldProps {
    id: string,
    label: string,
    name: string,
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    error: string | undefined,
}

const PasswordTextField = ({id, label, name, value, onChange, error}: IPasswordTextFieldProps) => {

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <FormControl
            variant="outlined"
            margin="normal"
            required
            fullWidth
        >
            <InputLabel htmlFor={id} style={{color: error ? "#D32F2F" : ""}}>{label}</InputLabel>
            <OutlinedInput
                id={id}
                type={showPassword ? 'text' : 'password'}
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                error={!!error}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                }
            />
            <FormHelperText style={{color: "#D32F2F"}}>{error}</FormHelperText>
        </FormControl>
    );
};

export default PasswordTextField;
