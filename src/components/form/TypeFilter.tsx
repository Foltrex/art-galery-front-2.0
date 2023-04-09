import {ChangeEvent, useEffect, useState} from "react";
import {FormControl, OutlinedInput} from "@mui/material";

export const TypeFilter: React.FC<{ onChange: (s: string) => void, placeholder: string }> = ({
                                                                                                 onChange,
                                                                                                 placeholder
                                                                                             }) => {
    const [state, setState] = useState({text: '', lastUpdate: new Date().getTime(), triggerUpdate: false});

    useEffect(() => {
        const interval = setInterval(function () {
            if (state.triggerUpdate && new Date().getTime() - state.lastUpdate > 500) {
                setState({...state, triggerUpdate: false});
                onChange(state.text);
            }
        }, 500);
        return () => clearInterval(interval);
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({text: e.target.value, lastUpdate: new Date().getTime(), triggerUpdate: true});
    }

    return <FormControl>
        <OutlinedInput value={state.text}
                       size={"small"}
                       placeholder={placeholder}
                       inputProps={{'aria-label': placeholder}}
                       onChange={handleChange}/>
    </FormControl>
}