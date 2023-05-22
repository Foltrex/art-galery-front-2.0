import * as React from 'react';
import Filter, {FilterElement} from '../ui/filter/Filter';
import {useGetAllArtTopic} from '../../api/ArtTopicApi';
import {getErrorMessage} from "../error/ResponseError";


interface IArtTopicFilterProps {
}

const ArtTopicFilter: React.FunctionComponent<IArtTopicFilterProps> = (props) => {
  const { data = [] } = useGetAllArtTopic((error) => {
    getErrorMessage("Failed to load list of art themes", error)
  });
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Themes'} variant={'checkbox'} content={content} />
  );
};

export default ArtTopicFilter;
