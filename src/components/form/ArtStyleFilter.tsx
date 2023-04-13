import { useGetAllArtStyles } from '../../api/ArtStyleApi';
import Filter, { FilterElement } from '../ui/filter/Filter';


const ArtStyleFilter = () => {
  const { data = [] } = useGetAllArtStyles();
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Styles'} variant={'checkbox'} content={content} />
  );
};

export default ArtStyleFilter;
