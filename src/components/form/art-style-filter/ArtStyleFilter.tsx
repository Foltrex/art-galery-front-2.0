import Filter, { FilterElement } from '../../ui/filter/Filter';
import { useGetArtStyleFilterContent } from './useGetStyleFilterContent';


const ArtStyleFilter = () => {
  const content: FilterElement[] = useGetArtStyleFilterContent();

  return (
    <Filter title={'Styles'} variant={'checkbox'} content={content} />
  );
};

export default ArtStyleFilter;
