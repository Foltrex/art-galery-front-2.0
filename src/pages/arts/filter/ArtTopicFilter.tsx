import * as React from 'react';
import Filter, { FilterElement } from '../../../components/ui/filter/Filter';

interface IArtTopicFilterProps {
}

const ArtTopicFilter: React.FunctionComponent<IArtTopicFilterProps> = (props) => {
    const content: FilterElement[] = [
        {label: 'Animals', value: 'animals'},
        {label: 'Pop-art', value: 'pop-art'},
        {label: 'Story', value: 'story'},
        {label: 'Modern', value: 'modern'},
        {label: 'Nude', value: 'nude'},
        {label: 'Surrealism', value: 'surrealism'},
        {label: 'Love', value: 'love'},
        {label: 'City', value: 'city'},
        {label: 'Nature', value: 'nature'},
        {label: 'Abstraction', value: 'abstraction'},
        {label: 'Gender', value: 'gender'},
        {label: 'Fashion', value: 'fashion'},
        {label: 'For him', value: 'for-him'},
        {label: 'For her', value: 'for-her'},
        {label: 'Gift', value: 'gift'},
        {label: 'Portrait', value: 'portrait'},
        {label: 'Landscape', value: 'landscape'},
        {label: 'Still life', value: 'still-life'},
        {label: 'Realism', value: 'realism'},
    ];

  return (
    <Filter title={'Topics'} variant={'checkbox'} content={content} />
  );
};

export default ArtTopicFilter;
