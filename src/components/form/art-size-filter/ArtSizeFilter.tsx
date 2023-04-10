import * as React from 'react';
import Filter, { FilterElement } from '../../ui/filter/Filter';
import { useGetArtSizeFilterContent } from './useGetArtSizeFilterContent';

interface IArtSizeFilterProps {
}

const ArtSizeFilter = () => {
  const content: FilterElement[] = useGetArtSizeFilterContent();

  return (
    <Filter title={'Sizes'} variant={'checkbox'} content={content} />
  );
};

export default ArtSizeFilter;
