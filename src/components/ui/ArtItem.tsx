import { Card, IconButton, ImageListItem, ImageListItemBar, Tooltip } from "@mui/material";
import { useGetAccountById } from "../../api/AccountApi";
import { useGetLastArtInfoByArtId } from "../../api/ArtInfoApi";
import EmptyArt from '../../assets/images/empty-art.svg';
import { Art } from "../../entities/art";
import { useGetArtListItemImageByArtId } from "../../hooks/useGetArtListItemImageByArtId";
import { FileService } from "../../services/FileService";
import { TokenService } from "../../services/TokenService";
import { useRootStore } from "../../stores/provider/RootStoreProvider";
import LetterAvatar from "./LetterAvatar";

interface IArtItemProps {
    art: Art;
    showAuthor?: boolean;
}

const ArtItem: React.FC<IArtItemProps> = ({ art, showAuthor = true }) => {
    // const { data: files } = useGetAllEntityFilesByEntityId(art.id);

    // let fileIds: string[] = [];
    // if (files) {
    //     files.forEach(file => {
    //         if (file.id && file.type === EntityFileTypeEnum.ORIGINAL) {
    //             fileIds.push(file.id);
    //         }
    //     })
    // }

    const { data: image } = useGetArtListItemImageByArtId(art.id);
    // const { data: imagesData } = useGetAllFileStreamByIds(fileIds);
    // const images = imagesData?.map(data => FileService.toImage(data));

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

                {image
                    ? <img
                        src={image}
                        alt={art.name}
                        loading='lazy'
                        style={{
                            cursor: 'pointer',
                            height: '100%',
                            width: 'auto'
                        }}
                        onClick={() => window.location.href = artLink}
                    />
                    : <img
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