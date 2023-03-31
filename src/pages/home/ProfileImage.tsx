import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import DefaultProfileImage from "../../assets/images/man.png";
import {FileService} from "../../services/FileService";
import {useGetAllFileStreamByIds} from "../../api/FileApi";
import {Avatar} from "@mui/material";
import {Account} from "../../entities/account";
import {useUpdateAccountImageById} from "../../api/AccountApi";
import {TokenService} from "../../services/TokenService";
import Loading from "../../components/ui/Loading";

const ProfileImage = (props: { account: Account }) => {

    const fileInput = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string>('');
    const mutationUpdateAccountImage = useUpdateAccountImageById(TokenService.getCurrentAccountId());

    const imageId = props.account.metadata.find(item => item.key === "account_image")?.value || '';
    const {data: imageData, isLoading, isIdle,} = useGetAllFileStreamByIds([imageId]);

    useEffect(() => {
        if (imageData !== undefined) {
            const image = FileService.toImage(imageData[0]);
            setImage(image)
        }
    }, [imageData])


    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files!;
        const currentFile = fileList[0];

        const currentImage = await FileService.toBase64fromBlob(currentFile);
        setImage(currentImage);

        if (currentFile !== undefined) {
            const fileEntity = await FileService.toFile(null, currentFile);
            await mutationUpdateAccountImage.mutateAsync(fileEntity)
        }
    }

    const Content = () => {
        if (isLoading || isIdle) {
            return <Loading/>
        } else {
            return (
                <>
                    <Avatar
                        alt="profile"
                        src={image !== '' ? image : DefaultProfileImage}
                        style={{
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
                </>
            )
        }
    }

    return (
        <div>
            <Content/>
        </div>
    );
};

export default ProfileImage;
