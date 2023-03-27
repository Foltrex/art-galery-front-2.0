import { ImageList } from '@mui/material';
import * as React from 'react';
import { InfiniteData } from 'react-query';
import { Art } from '../../entities/art';
import { IPage } from '../../hooks/react-query';
import ArtItem from '../../components/ui/ArtItem';

interface IInfiniteArtListProps {
    infinteData: InfiniteData<IPage<Art>>;
}

const InfiniteArtList: React.FunctionComponent<IInfiniteArtListProps> = ({ infinteData }) => {
    return (
        <ImageList
            gap={12}
            cols={3}
            rowHeight={300}
            sx={{ width: 'auto' }}
        >
            {infinteData.pages.map(page => (
                page.content.map(art => {
                    return <ArtItem key={art.id} art={art} />
                })
            ))}
        </ImageList>
    );
};

export default InfiniteArtList;
