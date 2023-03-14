import { Avatar, Button, Card, IconButton, ImageListItem, ImageListItemBar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetArtistByArtId } from "../../api/ArtistApi";
import { useGetLastArtInfoByArtId } from "../../api/ArtInfoApi";
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds } from "../../api/FileApi";
import { Art } from "../../entities/art";
import { AccountEnum } from "../../entities/enums/AccountEnum";
import { FileService } from "../../services/FileService";
import { TokenService } from "../../services/TokenService";
import EmptyArt from './empty-art.svg';
import DefaultQr from '../../assets/images/default-qr.svg';
import { useGenereateQRCode } from "../../api/QRCodeApi";
import { useState } from "react";
import QRModal from "./QRModal";
import LetterAvatar from "../../components/ui/LetterAvatar";

interface IArtItemProps {
    art: Art;
}

const ArtItem: React.FC<IArtItemProps> = ({ art }) => {
    const [showQRModal, setShowQrModal] = useState(false);

    const navigate = useNavigate();

    const accountType = TokenService.getCurrentAccountType();

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
    
    console.log(artLink);
    const { data: artist } = useGetArtistByArtId(art.id);
    // const { data: qrData } = useGenereateQRCode(artLink);
    // const qrImage = qrData && URL.createObjectURL(qrData);

    return (
        <Card>
            <ImageListItem>
                <ImageListItemBar
                    sx={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7)0%, rgba(0, 0, 0, 0.7)70%, rgba(0, 0, 0, 0)100%)'
                    }}
                    title={facilityName}
                    position='top'
                    actionIcon={
                        <Tooltip title={artist?.firstname + ' ' + artist?.lastname}>
                            <IconButton>
                                <LetterAvatar 
                                    name={artist?.firstname + ' ' + artist?.lastname} 
                                    sx={{w: 28, h: 28, mr: 1}}
                                />
                            </IconButton>
                        </Tooltip>
                    }
                    // actionIcon={
                    //     <Button onClick={() => setShowQrModal(true)}>
                    //         {qrImage
                    //             ? <img src={qrImage} width={26} height={26} />
                    //             : <img src={DefaultQr} width={26} height={26} />
                    //         }
                    //     </Button>
                    // }
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
            
            {/* <QRModal open={showQRModal} onClose={() => setShowQrModal(false)} qr={qrImage} /> */}
        </Card>
    );
}

export default ArtItem;