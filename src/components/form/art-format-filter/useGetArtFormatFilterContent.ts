import { FilterElement } from "../../ui/filter/Filter"

export const useGetArtFormatFilterContent = (): FilterElement[] => {
    return [
        {label: 'Horisontal', value: 'horisontal'},
        {label: 'Vertical', value: 'vertical'},
        {label: 'Square', value: 'square'},
        {label: 'Circle', value: 'circle'},
        {label: 'Ellipsis', value: 'ellipsis'},
        {label: 'Diptych', value: 'diptych'},
        {label: 'Triptych', value: 'triptych'},
        {label: 'Polyptych', value: 'polyptych'},
    ];
}