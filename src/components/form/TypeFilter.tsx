import * as React from "react";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {FormControl, OutlinedInput} from "@mui/material";

interface TypeFilterProps {
    style?: React.CSSProperties,
    onChange: (s: string) => void,
    placeholder?: string,
    label?: string
    inputProps?: any
    autoFocus?: boolean
}

export const TypeFilter: React.FC<TypeFilterProps> = ({style, autoFocus, inputProps, onChange, label, placeholder}) => {
    const [state, setState] = useState({text: '', lastUpdate: new Date().getTime(), triggerUpdate: false});
    const inputRef = useRef();

    useEffect(() => {
        const interval = setInterval(function () {
            if (state.triggerUpdate && new Date().getTime() - state.lastUpdate > 500) {
                setState({...state, triggerUpdate: false});
                onChange(state.text);
            }
        }, 500);
        return () => {
            clearInterval(interval);
        }
    }, [state])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({text: e.target.value, lastUpdate: new Date().getTime(), triggerUpdate: true});
    }

    return <FormControl style={style}>
        <OutlinedInput {...inputProps}
                       inputRef={inputRef}
                       value={state.text}
                       size={"small"}
                       label={label}
                       placeholder={placeholder}
                       inputProps={{'aria-label': placeholder}}
                       onChange={handleChange}/>
    </FormControl>
}