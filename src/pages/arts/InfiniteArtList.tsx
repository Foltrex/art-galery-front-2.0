import { ImageList } from '@mui/material';
import * as React from 'react';
import { InfiniteData } from 'react-query';
import { Art } from '../../entities/art';
import { IPage } from '../../hooks/react-query';
import ArtItem from './ArtItem';

interface IInfiniteArtListProps {
    infinteData: InfiniteData<IPage<Art>>;
}

const InfiniteArtList: React.FunctionComponent<IInfiniteArtListProps> = ({ infinteData }) => {
    infinteData.pages.map((page, i) => {
        console.log(page)
    }); 
    return (
        <ImageList
            gap={12}
            cols={3}
            rowHeight={300}
            sx={{ width: 'auto' }}
        >
            {infinteData.pages.map((page, i) => (
                page.content.map((art, j) => {
                    return <ArtItem key={10 * i + j} art={art} />
                })
            ))}
        </ImageList>
    );
};

export default InfiniteArtList;
