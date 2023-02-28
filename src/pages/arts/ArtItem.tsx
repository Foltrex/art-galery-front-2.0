import { Card, ImageListItem, ImageListItemBar } from "@mui/material";
import { width } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useGetArtInfosByAccountId } from "../../api/ArtInfoApi";
import { useGetFacilityByAccountId } from "../../api/FacilityApi";
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds } from "../../api/FileApi";
import { Art } from "../../entities/art";
import { AccountEnum } from "../../entities/enums/AccountEnum";
import { FileService } from "../../services/FileService";
import { TokenService } from "../../services/TokenService";
import EmptyArt from './empty-art.svg';

interface IArtItemProps {
    art: Art;
}

const ArtItem: React.FC<IArtItemProps> = ({ art }) => {
    const navigate = useNavigate();

    const accountType = TokenService.getCurrentAccountType();
    const accountId = TokenService.getCurrentAccountId();

    const { data: files } = useGetAllFileInfosByArtId(art.id)

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

    const { data: artInfo } = useGetArtInfosByAccountId(art.id);
    console.log(artInfo)
    let facilityName = ''
    if (artInfo?.facility) {
        const { name } = artInfo.facility;
        facilityName = name ?? 'Exhibited';
    } else {
        facilityName = 'Avalable';
    }

    let artLink = '';
    switch (accountType) {
        case AccountEnum.REPRESENTATIVE: {
            artLink = `/arts/representative/${art.id}`;
            break;
        }
        case AccountEnum.ARTIST: {
            artLink = `/arts/artist/${art.id}`;
            break;
        }
        default: {
            throw new Error('Unknown account enum');
        }
    }

    return (
        <Card>
            <ImageListItem>
                <ImageListItemBar
                    sx={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7)0%, rgba(0, 0, 0, 0.7)70%, rgba(0, 0, 0, 0)100%)'
                    }}
                    title={facilityName}
                    position='top' />

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
                            onClick={() => navigate(`/arts/representative/${art.id}`)}
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
                            onClick={() => navigate(artLink)}
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