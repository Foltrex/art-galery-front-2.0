import {useGetAllArtStyles} from '../../api/ArtStyleApi';
import Filter, {FilterElement} from '../ui/filter/Filter';
import {getErrorMessage} from "../error/ResponseError";


const ArtStyleFilter = () => {
  const { data = [] } = useGetAllArtStyles((error) => {
    getErrorMessage("Failed to load for art styles list", error)
  });
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Styles'} variant={'checkbox'} content={content} />
  );
};

export default ArtStyleFilter;
