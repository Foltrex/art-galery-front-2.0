import {Card, ImageListItem, Skeleton, Typography} from '@mui/material';
import * as React from 'react';
import {Art} from '../../../entities/art';
import {useGetAllEntityFilesByEntityId} from "../../../api/FileApi";
import {EntityFileTypeEnum} from "../../../entities/enums/EntityFileTypeEnum";
import {buildImageUrl} from "../../../util/PrepareDataUtil";

interface IArtCardProps {
    art: Art;
    onPropose: (art: Art) => void;
}

const ArtCard: React.FunctionComponent<IArtCardProps> = ({art, onPropose}) => {

    const { isLoading, data: files = [] } = useGetAllEntityFilesByEntityId(0, art.id);
    const images = files
        .filter(file => file.id && file.isPrimary && file.type === EntityFileTypeEnum.ORIGINAL)
        .map(fileEntity => buildImageUrl(fileEntity.id!))
    const image = images.length && images.length > 0 ? images[0] : null;

    const renderImage = () => {
        if (image) {
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

        if (isLoading) {
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
