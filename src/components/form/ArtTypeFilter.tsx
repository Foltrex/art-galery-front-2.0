import * as React from 'react';
import Filter, {FilterElement} from '../ui/filter/Filter';


const ArtTypeFilter = () => {
    const content: FilterElement[] = [
        {label: 'Picture', value: 'picture'},
        {label: 'Photo', value: 'photo'},
        {label: 'Drawing', value: 'drawing'},
        {label: 'Sculpture', value: 'sculpture'},
    ];

  return (
    <Filter title={'Types'} variant={'checkbox'} content={content} />
  );
};

export default ArtTypeFilter;
