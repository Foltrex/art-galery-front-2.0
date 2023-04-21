import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {UseQueryResult} from "react-query/types/react/types";

interface State<T> {
    value:T|null,
    optionSelected: boolean,
    text:string,
    lastUpdate:number,
    triggerUpdate:boolean
}

export default function GenericAutocomplete<T, E>({renderOption, reactAt, queryResult, mapFunction, searchChanged, onChange, label, noOptionsText} : {
    renderOption:(v:T) => string,
    mapFunction:(e:E) => T[]
    queryResult: UseQueryResult<E>
    searchChanged:(v:string) => void
    label: string
    noOptionsText:string
    onChange: (v?:T) => void
    reactAt:number
}) {
    const [state, setState] = useState<State<T>>({value: null, optionSelected:false, text: '', lastUpdate: new Date().getTime(), triggerUpdate: false});

    useEffect(() => {
        const interval = setInterval(function () {
            if (state.triggerUpdate && new Date().getTime() - state.lastUpdate > 500) {
                setState({...state, triggerUpdate: false});
                if((!state.text || state.text.length >= reactAt)) {
                    searchChanged(state.text);
                }
            }
        }, 500);
        return () => clearInterval(interval);
    })

    const inProcess = queryResult && queryResult.isError && queryResult.isFetching && queryResult.isLoading;
    const optionsToRender = useMemo(() => {
        if(inProcess || !state.text || state.text.length < reactAt) {
            return [];
        }
        if(state.optionSelected) {
            return [state.value as T]
        }
        return queryResult.data ? mapFunction(queryResult.data) : [];
    }, [inProcess, state.text, queryResult?.data, state.optionSelected])

    const acValue = useMemo(() => {
        for(let i = 0; i < optionsToRender.length; i++) {
            if(optionsToRender[i] === state.value) {
                return state.value;
            }
        }
        return null;
    }, [optionsToRender, state.value])

    return (
        <Autocomplete
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : renderOption(option)
            }
            filterOptions={(x) => x}
            options={optionsToRender}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={acValue}
            noOptionsText={noOptionsText}
            onChange={(event: any, newValue: T | null, a) => {
                setState({value: newValue, text: newValue ? renderOption(newValue) : '', lastUpdate: new Date().getTime(), triggerUpdate: false, optionSelected: true });
                onChange(newValue || undefined)
            }}
            onInputChange={(event, newInputValue, e) => {
                if(e === 'reset') {
                    return;
                }
                console.log(newInputValue);
                setState({value: null, text: newInputValue, lastUpdate: new Date().getTime(), triggerUpdate: true, optionSelected: false });
            }}
            renderInput={(params) => {
                console.log(params, state.text);
                return (
                <TextField {...params} inputProps={{...params.inputProps, value: state.text}} label={label} fullWidth size={"small"} />
            )}}
            renderOption={(optionProps, option) => {
                return (
                    <li {...optionProps}>
                        {renderOption(option)}
                    </li>
                );
            }}
        />
    );
}