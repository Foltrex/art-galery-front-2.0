import {Card, IconButton, ImageListItem, ImageListItemBar, Tooltip} from "@mui/material";
import {useGetAccountById} from "../../../api/AccountApi";
import {useGetLastArtInfoByArtId} from "../../../api/ArtInfoApi";
import EmptyArt from '../../../assets/images/empty-art.svg';
import {Art} from "../../../entities/art";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import LetterAvatar from "../../../components/ui/LetterAvatar";
import {useNavigate} from "react-router-dom";
import {useGetAllEntityFilesByEntityId} from "../../../api/FileApi";
import {EntityFileTypeEnum} from "../../../entities/enums/EntityFileTypeEnum";
import {buildImageUrl} from "../../../util/PrepareDataUtil";

interface IArtItemProps {
    art: Art;
    showAuthor?: boolean;
}

const ArtItem: React.FC<IArtItemProps> = ({ art, showAuthor = true }) => {
    const navigate = useNavigate();

    const { data: files = [] } = useGetAllEntityFilesByEntityId(art.id);
    const images = files
        .filter(file => file.id && file.isPrimary && file.type === EntityFileTypeEnum.ORIGINAL)
        .map(fileEntity => buildImageUrl(fileEntity.id!))
    const image = images.length && images.length > 0 ? images[0] : null;

    const { data: artInfo } = useGetLastArtInfoByArtId(art.id);

    let facilityName = ''
    if (artInfo?.facility) {
        const { name } = artInfo.facility;
        facilityName = name ?? 'Exhibited';
    } else {
        facilityName = 'Available';
    }

    const { authStore } = useRootStore();
    const { data: account } = useGetAccountById(art.artistAccountId) ?? authStore.account;

    return (
        <Card>
            <ImageListItem sx={{ border: 1, borderColor: 'grey.300' }}>
                <ImageListItemBar
                    sx={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7)0%, rgba(0, 0, 0, 0.7)70%, rgba(0, 0, 0, 0)100%)'
                    }}
                    title={facilityName}
                    position='top'
                    actionIcon={
                        showAuthor &&
                        <Tooltip title={account?.firstName + ' ' + account?.lastName}>
                            <IconButton onClick={() => {
                                // navigate(`/artists/${art.artist.id}`)
                            }}>
                                <LetterAvatar
                                    name={account?.firstName + ' ' + account?.lastName}
                                    sx={{ w: 28, h: 28, mr: 1 }}
                                />
                            </IconButton>
                        </Tooltip>
                    }
                />

                {<img src={image ? image : EmptyArt}
                        alt={art.name}
                        loading='lazy'
                        style={{
                            cursor: 'pointer',
                            objectFit: image ? undefined : 'scale-down',
                            height: '100%',
                            width: 'auto'
                        }}
                        onClick={() => navigate('/gallery/' + art.id)}
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