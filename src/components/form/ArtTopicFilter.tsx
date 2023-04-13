import * as React from 'react';
import Filter, {FilterElement} from '../ui/filter/Filter';
import { useGetAllArtTopic } from '../../api/ArtTopicApi';

interface IArtTopicFilterProps {
}

const ArtTopicFilter: React.FunctionComponent<IArtTopicFilterProps> = (props) => {
  const { data = [] } = useGetAllArtTopic();
  const content = data.map(item => ({
    label: item.label
  } as FilterElement));

  return (
    <Filter title={'Topics'} variant={'checkbox'} content={content} />
  );
};

export default ArtTopicFilter;
