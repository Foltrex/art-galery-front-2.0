import { Card, IconButton, ImageListItem, ImageListItemBar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetLastArtInfoByArtId } from "../../api/ArtInfoApi";
import { useGetArtistByArtId } from "../../api/ArtistApi";
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds } from "../../api/FileApi";
import EmptyArt from '../../assets/images/empty-art.svg';
import { Art } from "../../entities/art";
import { FileService } from "../../services/FileService";
import { TokenService } from "../../services/TokenService";
import LetterAvatar from "./LetterAvatar";

interface IArtItemProps {
    art: Art;
    showAuthor?: boolean;
}

const ArtItem: React.FC<IArtItemProps> = ({ art, showAuthor = true }) => {
    const navigate = useNavigate();

    const { data: files } = useGetAllFileInfosByArtId(art.id);

    let fileIds: string[] = [];
    if (files) {
        files.forEach(file => {
            if (file.id) {
                fileIds.push(file.id);
            }
        })
    }

    const { data: imagesData } = useGetAllFileStreamByIds(fileIds);
    const images = imagesData?.map(data => FileService.toImage(data));

    const { data: artInfo } = useGetLastArtInfoByArtId(art.id);
    
    let facilityName = ''
    if (artInfo?.facility) {
        const { name } = artInfo.facility;
        facilityName = name ?? 'Exhibited';
    } else {
        facilityName = 'Available';
    }


    const artLink = FileService.createImageLinkForAccountType(
        art.id!, 
        TokenService.getCurrentAccountType()
    );
    
    const { data: artist } = useGetArtistByArtId(art.id);

    return (
        <Card>
            <ImageListItem sx={{border: 1, borderColor: 'grey.300' }}>
                <ImageListItemBar
                    sx={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7)0%, rgba(0, 0, 0, 0.7)70%, rgba(0, 0, 0, 0)100%)'
                    }}
                    title={facilityName}
                    position='top'
                    actionIcon={
                        showAuthor && 
                            <Tooltip title={artist?.firstname + ' ' + artist?.lastname}>
                                <IconButton onClick={() => navigate(`/artists/${art.artist.id}`)}>
                                    <LetterAvatar 
                                        name={artist?.firstname + ' ' + artist?.lastname} 
                                        sx={{w: 28, h: 28, mr: 1}}
                                    />
                                </IconButton>
                            </Tooltip>
                    }
                    />

                {images && images.at(0) 
                    ?   <img
                            src={images?.at(0)}
                            alt={art.name}
                            loading='lazy'
                            style={{ 
                                cursor: 'pointer',
                                height: '100%',
                                width: 'auto'
                            }}
                            onClick={() => window.location.href = artLink}
                        />
                    :   <img 
                            src={EmptyArt}
                            alt={art.name}
                            loading='lazy'
                            style={{ 
                                cursor: 'pointer', 
                                objectFit: 'scale-down',
                                height: '100%',
                                width: 'auto'
                            }}
                            onClick={() => window.location.href = artLink}
                        />
                }
                <ImageListItemBar
                    title={art.name}
                />
            </ImageListItem>
        </Card>
    );
}

export default ArtItem;