import * as React from 'react';
import Filter, {FilterElement} from '../ui/filter/Filter';
import {useGetAllArtTypes} from '../../api/ArtTypeApi';
import {getErrorMessage} from "../error/ResponseError";


const ArtTypeFilter = () => {
  const { data = [] } = useGetAllArtTypes((e) => {
    getErrorMessage("Failed to load list of art types", e);
  });
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Types'} variant={'checkbox'} content={content} />
  );
};

export default ArtTypeFilter;
