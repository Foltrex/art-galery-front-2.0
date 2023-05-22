import {useGetAllArtFormats} from '../../api/ArtFormatApi';
import Filter, {FilterElement} from '../ui/filter/Filter';
import {getErrorMessage} from "../error/ResponseError";


const ArtFormatFilter = () => {
    const {data = []} = useGetAllArtFormats((error) => {
        getErrorMessage("Failed to load configuration property for art formats", error);
    });
    const content = data.map(item => ({
        label: item.label
    } as FilterElement));

    return (
        <Filter title={'Formats'} variant='radio' content={content}/>
    );
};

export default ArtFormatFilter;
