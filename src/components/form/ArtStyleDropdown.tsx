import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent} from "@mui/material";
import * as React from "react";
import {useMemo} from "react";
import {ArtStyle} from "../../entities/art-style";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {useGetAllArtStyles} from "../../api/ArtStyleApi";

export const ArtStyleDropdown = ({value, onChange}:{value:ArtStyle[], onChange: (v:ArtStyle[]) => void}) => {

    const { data: artStyleItems = []} = useGetAllArtStyles();

    const handleStyleSelect = (e: SelectChangeEvent<number[]>) => {
        const ids = e.target.value as number[];
        onChange(ids.map(id => artStyleItems.find(s => s.id === id)!));
    }
    const handleStyleDeselect = (id:number) => {
        const result:ArtStyle[] = [];
        for(let i = 0; i < value.length; i++) {
            if(value[i].id !== id) {
                result.push(value[i]);
            }
        }
        onChange(result);
    }

    const selectedStylesIds = useMemo(() => value.map(s => s.id), [value]);
    const selectedStylesMap = useMemo(() => value.reduce((p, n) => {
        p[n.id] = n;
        return p;
    }, {} as Record<string, ArtStyle>), [value]);

    const shownStyles = useMemo(() => {
        return artStyleItems.filter(s => !selectedStylesMap[s.id])
    }, [selectedStylesMap, artStyleItems]);

    return <FormControl>
        <InputLabel>Art Style</InputLabel>
        <Select
            labelId="style-select"
            multiple
            size={"small"}
            value={selectedStylesIds}
            onChange={handleStyleSelect}
            sx={{ lineHeight: 'normal' }}
            input={<OutlinedInput id="style-select-chip" label="Styles" />}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={selectedStylesMap[value].label}
                              deleteIcon={<CancelOutlinedIcon
                                onMouseDown={(event) => event.stopPropagation()}
                              />
                        } onDelete={() => handleStyleDeselect(value)} />
                    ))}
                </Box>
            )}
        >
            {shownStyles.map((name) => (
                <MenuItem
                    key={name.id}
                    value={name.id}
                >
                    {name.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
}