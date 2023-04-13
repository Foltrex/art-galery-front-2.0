import { useGetAllArtSizes } from '../../api/ArtSizeApi';
import Filter, { FilterElement } from '../ui/filter/Filter';

interface IArtSizeFilterProps {
}

const ArtSizeFilter = () => {
  const { data = [] } = useGetAllArtSizes();
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Sizes'} variant={'checkbox'} content={content} />
  );
};

export default ArtSizeFilter;
