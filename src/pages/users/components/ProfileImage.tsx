import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import DefaultProfileImage from "../../../assets/images/man.png";
import {FileService} from "../../../services/FileService";
import {Avatar} from "@mui/material";
import {Account} from "../../../entities/account";
import Loading from "../../../components/ui/Loading";
import {axiosApi, USER_SERVICE} from "../../../http/axios";
import {AuthService} from "../../../services/AuthService";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {buildImageUrl, getErrorMessage} from "../../../util/PrepareDataUtil";
import {find} from "../../../util/MetadataUtil";
import Bubble from '../../../components/bubble/Bubble';
import {Metadata} from "../../../entities/metadata";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

const ProfileImage = (props: { canEdit: boolean, account: Account, imageUpdated: (metadata: undefined | null | Metadata) => void }) => {

    const fileInput = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string>();
    const [newImageId, setNewImageId] = useState<string>();

    const imageId = useMemo(
        () => {
            if(newImageId) {
                return newImageId;
            }
            return find(MetadataEnum.ACCOUNT_IMAGE, props.account) || ''
        },
        [props.account, newImageId]
    );

    useEffect(() => {
        if (imageId !== "") {
            setImage(buildImageUrl(imageId))
        } else {
            setImage("empty")
        }
    }, [imageId])


    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files!;
        const currentFile = fileList[0];
        if (currentFile !== undefined) {
            const fileEntity = await FileService.toEntityFile('', currentFile);
            await axiosApi.patch<Metadata>(`${USER_SERVICE}/accounts/${props.account.id}/account-image`, fileEntity, {
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`,
                }
            }).then((e) => {
                setImage(buildImageUrl(e.data.value));
                setNewImageId(e.data.value);
                Bubble.success("Account image was updated")
                props.imageUpdated(e.data);
            }).catch(e => {
                Bubble.error({
                    message: "Failed to update profile image. Error message is " + getErrorMessage(e),
                    duration: 999999
                })
            })
        }
    }

    if (!image) {
        return <Loading/>
    }

    return (<div>
        <div style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            cursor: props.canEdit ? "pointer" : undefined,
            position: "relative",
            width: 256
        }}>
            <Avatar
                alt="profile"
                src={image !== 'empty' ? image : DefaultProfileImage}

                onClick={() => props.canEdit && fileInput.current?.click()}
                sx={{width: 256, height: 256}}
            />
            {props.canEdit && image !== 'empty' && <DeleteForeverOutlinedIcon
                color={"error"}
                style={{position: "absolute", right: 0, top: 0}}
                onClick={() => {
                    setImage("empty");
                    props.imageUpdated(null);
                }}/>}

            {props.canEdit && image === 'empty' && imageId && <UndoOutlinedIcon
                color={"success"}
                style={{position: "absolute", right: 0, top: 0}}
                onClick={() => {
                    setImage(buildImageUrl(imageId));
                    props.imageUpdated(undefined);
                }}/>
            }

        </div>
        <input
            type='file'
            ref={fileInput}
            onChange={handleFileInputChange}
            style={{display: 'none'}}
        />
    </div>)
};

export default ProfileImage;
