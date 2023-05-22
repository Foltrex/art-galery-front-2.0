import React, {ChangeEvent, useRef, useState} from 'react';
import DefaultProfileImage from "../../../assets/images/man.png";
import {Avatar} from "@mui/material";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {buildImageUrl, uploadTempFile} from "../../../util/PrepareDataUtil";
import {Metadata} from "../../../entities/metadata";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {getErrorMessage} from "../../../components/error/ResponseError";
import {useSaveTempFile} from "../../../api/FileApi";

const ProfileImage = (props: { canEdit: boolean, accountImage?: Metadata, imageUpdated: (metadata: null | Metadata) => void }) => {
    const {canEdit, accountImage, imageUpdated} = props;
    const fileInput = useRef<HTMLInputElement>(null);
    const [initialImage] = useState(accountImage);

    const saveFile = useSaveTempFile((e) => {
        getErrorMessage("Failed to upload file", e);
    });

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        return uploadTempFile(e, saveFile).then((e) => {
            imageUpdated({key: MetadataEnum.ACCOUNT_IMAGE, value: e.data.id});
        }).catch(e => {
            getErrorMessage("Failed to update profile image", e)
        })
    }

    //if can edit, and initial image exists, and new image not uploaded
    //(if image uploaded, delete icon is shown)
    let showRollback = canEdit && initialImage && !accountImage;

    return (<div>
        <div style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            cursor: canEdit ? "pointer" : undefined,
            position: "relative",
            width: 256
        }}>
            <Avatar
                alt="profile"
                src={accountImage ? buildImageUrl(accountImage.value) : DefaultProfileImage}
                onClick={() => canEdit && fileInput.current?.click()}
                sx={{width: 256, height: 256}}
            />
            {canEdit && accountImage && <DeleteForeverOutlinedIcon
                color={"error"}
                style={{position: "absolute", right: 0, top: 0}}
                onClick={() => {
                    imageUpdated(null);
                }}/>}

            {showRollback && <UndoOutlinedIcon
                color={"success"}
                style={{position: "absolute", right: 0, top: 0}}
                onClick={() => {
                    imageUpdated(initialImage || null);
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
