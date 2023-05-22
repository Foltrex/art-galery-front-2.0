import {IconButton, ImageListItem, ImageListItemBar, Tooltip} from "@mui/material";
import {useGetAccountById} from "../../../api/AccountApi";
import EmptyArt from '../../../assets/images/empty-art.svg';
import {Art} from "../../../entities/art";
import LetterAvatar from "../../../components/ui/LetterAvatar";
import {useNavigate} from "react-router-dom";
import {EntityFileTypeEnum} from "../../../entities/enums/EntityFileTypeEnum";
import {buildImageUrl} from "../../../util/PrepareDataUtil";
import {useMemo} from "react";
import {getErrorMessage} from "../../../components/error/ResponseError";

interface IArtItemProps {
    art: Art;
    showAuthor?: boolean;
    imageType: EntityFileTypeEnum;
}
const style = {marginBottom: '20px', minHeight: '15px', cursor: 'pointer',};
const ArtItem: React.FC<IArtItemProps> = ({ art, imageType, showAuthor = true }) => {
    const navigate = useNavigate();

    const image = useMemo(() => {
        const images = (art.files || [])
            .filter(file => file.id && file.isPrimary && file.type === imageType)
            .map(file => buildImageUrl(file.id!))
        return images.length && images.length > 0 ? images[0] : null;
    }, [art.files])

    const artInfo = useMemo(() => {
        if(!art.artInfos) {
            return undefined;
        }
        for(let i = 0; i < art.artInfos.length; i++) {
            if(!art.artInfos[i].expositionDateEnd) {
                return art.artInfos[i];
            }
        }
        return undefined;
    }, [art.artInfos]);

    let facilityName = ''
    if (artInfo?.facility) {
        const { name } = artInfo.facility;
        facilityName = name ?? 'Exhibited';
    } else {
        facilityName = 'Available';
    }

    const {data: account} = useGetAccountById(art.artistAccountId, (e) => {
        getErrorMessage("Failed to load artist profile information", e);
    });

    return (
            <ImageListItem style={style} onClick={() => navigate('/gallery/' + art.id)}>
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
                                navigate(`/users/${art.artistAccountId}`)
                            }}>
                                <LetterAvatar
                                    account={account}
                                    sx={{ w: 28, h: 28, mr: 1 }}
                                />
                            </IconButton>
                        </Tooltip>
                    }
                />

                <img src={image ? image : EmptyArt}
                        alt={art.name}
                        loading='lazy'
                        style={{

                            objectFit: image ? undefined : 'scale-down',
                            width: '100%'
                        }}

                    />

                <ImageListItemBar
                    title={art.name}
                />
            </ImageListItem>
    );
}

export default ArtItem;