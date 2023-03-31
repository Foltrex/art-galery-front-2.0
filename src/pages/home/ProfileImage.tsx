import React, {ChangeEvent, useRef, useState} from 'react';
import DefaultProfileImage from "../../assets/images/man.png";
import {FileService} from "../../services/FileService";
import {useSaveFile} from "../../api/FileApi";
import {Avatar} from "@mui/material";

const ProfileImage = () => {

    const fileInput = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string>('');
    const mutationSaveImage = useSaveFile();

    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files!;
        const currentFile = fileList[0];

        const currentImage = await FileService.toBase64fromBlob(currentFile);
        setImage(currentImage);

        if (currentFile !== undefined) {
            const fileEntity = await FileService.toFile(null, currentFile);
            await mutationSaveImage.mutateAsync(fileEntity);
        }
    }

    return (
        <div>
            <Avatar
                alt="Remy Sharp"
                src={image !== '' ? image : DefaultProfileImage}
                style={{
                    maxHeight: '270px',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    cursor: "pointer",
                }}
                onClick={() => fileInput.current?.click()}
                sx={{width: 256, height: 256}}
            />
            <input
                type='file'
                ref={fileInput}
                onChange={handleFileInputChange}
                style={{display: 'none'}}
            />
        </div>
    );
};

export default ProfileImage;
