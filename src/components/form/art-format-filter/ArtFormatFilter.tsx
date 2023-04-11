import Filter, { FilterElement } from '../../ui/filter/Filter';
import { useGetArtFormatFilterContent } from './useGetArtFormatFilterContent';

const ArtFormatFilter = () => {
  const content: FilterElement[] = useGetArtFormatFilterContent();

  return (
    <Filter title={'Formats'} variant='radio' content={content} />
  );
};

export default ArtFormatFilter;
