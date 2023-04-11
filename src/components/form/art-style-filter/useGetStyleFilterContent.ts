import { FilterElement } from "../../ui/filter/Filter";

export const useGetArtStyleFilterContent = (): FilterElement[] => {
    return [
        {label: 'Abstractionism', value: 'abstractionism'},
        {label: 'Still life', value: 'still-life'},
        {label: 'Landscape', value: 'landscape'},
        {label: 'Portrait', value: 'portrait'},
        {label: 'SEI', value: 'sei'},
        {label: 'Cubism', value: 'cubism'},
        {label: 'Pop-art', value: 'pop-art'},
        {label: 'Actual art', value: 'actual-art'},
        {label: 'Geometric abstraction', value: 'geometric-abstraction'},
        {label: 'Realism', value: 'realism'},
        {label: 'Hyperrealism', value: 'hyperrealism'},
        {label: 'Impressionism', value: 'impressionism'},
        {label: 'Modernism', value: 'modernism'},
        {label: 'Surrealism', value: 'surrealism'},
        {label: 'Figurative art', value: 'figurative-art'},
        {label: 'Digital art', value: 'digital-art'},
    ];
}