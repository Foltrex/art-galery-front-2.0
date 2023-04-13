import { useGetAllArtFormats } from '../../api/ArtFormatApi';
import Filter, { FilterElement } from '../ui/filter/Filter';

const ArtFormatFilter = () => {
  const { data = [] } = useGetAllArtFormats();
    const content = data.map(item => ({
      label: item.label
    } as FilterElement));

  return (
    <Filter title={'Formats'} variant='radio' content={content} />
  );
};

export default ArtFormatFilter;
