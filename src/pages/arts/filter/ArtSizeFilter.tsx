import * as React from 'react';
import Filter, { FilterElement } from '../../../components/ui/filter/Filter';

interface IArtSizeFilterProps {
}

const ArtSizeFilter = () => {
    const content: FilterElement[] = [
        {label: 'Small (less then 30x30)', value: 'small'},
        {label: 'Medium (less then 80x80)', value: 'medium'},
        {label: 'Big (less then 150x150)', value: 'big'},
        {label: 'Huge (bigger then 150x150)', value: 'huge'},
    ];

  return (
    <Filter title={'Sizes'} variant={'checkbox'} content={content} />
  );
};

export default ArtSizeFilter;
