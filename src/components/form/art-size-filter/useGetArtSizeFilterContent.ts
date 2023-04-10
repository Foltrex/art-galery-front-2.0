import { FilterElement } from "../../ui/filter/Filter";

export const useGetArtSizeFilterContent = (): FilterElement[] => {
    return [
        {label: 'Small (less then 30x30)', value: 'small'},
        {label: 'Medium (less then 80x80)', value: 'medium'},
        {label: 'Big (less then 150x150)', value: 'big'},
        {label: 'Huge (bigger then 150x150)', value: 'huge'},
    ];
}