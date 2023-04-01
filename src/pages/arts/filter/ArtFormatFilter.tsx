
import Filter, { FilterElement } from '../../../components/ui/filter/Filter';

interface IArtFormatFilterProps {
}

const ArtFormatFilter = () => {
    const content: FilterElement[] = [
        {label: 'Horisontal', value: 'horisontal'},
        {label: 'Vertical', value: 'vertical'},
        {label: 'Square', value: 'square'},
        {label: 'Circle', value: 'circle'},
        {label: 'Ellipsis', value: 'ellipsis'},
        {label: 'Diptych', value: 'diptych'},
        {label: 'Triptych', value: 'triptych'},
        {label: 'Polyptych', value: 'polyptych'},
    ];

  return (
    <Filter title={'Formats'} variant='radio' content={content} />
  );
};

export default ArtFormatFilter;
