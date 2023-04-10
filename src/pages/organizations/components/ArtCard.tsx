import {Card, ImageListItem, Skeleton, Typography} from '@mui/material';
import * as React from 'react';
import {Art} from '../../../entities/art';
import {useGetArtListItemImageByArtId} from '../../../hooks/useGetArtListItemImageByArtId';

interface IArtCardProps {
    art: Art;
    onPropose: (art: Art) => void;
}

const ArtCard: React.FunctionComponent<IArtCardProps> = ({art, onPropose}) => {
    const [openProposalDialog, setOpenProposalDialog] = React.useState(false);

    const {
        data: image,
        isFetched: isImageFetched,
        isLoading: isImageLoading
    } = useGetArtListItemImageByArtId(art.id);


    const renderImage = () => {
        if (isImageFetched && image) {
            return (
                <img
                    src={image}
                    alt={art.name}
                    style={{
                        width: 'auto',
                        height: '100%',
                    }}
                />
            );
        }

        if (isImageLoading) {
            return (
                <Skeleton
                    width='100%'
                    height='100%'
                />
            );
        }

        if (!image) {
            return (
                <Typography
                    sx={{
                        height: '100%',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        paddingY: '25%',
                        border: 'solid 0.5px',
                        borderRadius: 1,
                        textAlign: 'center',
                    }}
                >
                    Here must be image
                </Typography>
            );
        }
    }

    return (
        <Card
            onClick={() => onPropose(art)}
            sx={{boxShadow: 'none', cursor: 'pointer'}}
        >
            <ImageListItem>
                {renderImage()}
            </ImageListItem>
            <Typography variant='h6' sx={{mt: 1, mb: 2, fontStyle: 'italic'}}>{art.name}</Typography>
        </Card>
    );
};

export default ArtCard;
