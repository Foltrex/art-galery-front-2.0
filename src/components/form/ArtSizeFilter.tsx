import {useGetAllArtSizes} from '../../api/ArtSizeApi';
import Filter, {FilterElement} from '../ui/filter/Filter';
import {getErrorMessage} from "../error/ResponseError";


interface IArtSizeFilterProps {
}

const ArtSizeFilter = () => {
  const { data = [] } = useGetAllArtSizes((error) => {
    getErrorMessage("Failed to load configuration property for art sizes", error);
  });
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Sizes'} variant={'checkbox'} content={content} />
  );
};

export default ArtSizeFilter;
