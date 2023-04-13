import * as React from 'react';
import Filter, {FilterElement} from '../ui/filter/Filter';
import { useGetAllArtTypes } from '../../api/ArtTypeApi';


const ArtTypeFilter = () => {
  const { data = [] } = useGetAllArtTypes();
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Types'} variant={'checkbox'} content={content} />
  );
};

export default ArtTypeFilter;
