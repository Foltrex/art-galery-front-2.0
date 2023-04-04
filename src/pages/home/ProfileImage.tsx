import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import DefaultProfileImage from "../../assets/images/man.png";
import {FileService} from "../../services/FileService";
import {Avatar} from "@mui/material";
import {Account} from "../../entities/account";
import {TokenService} from "../../services/TokenService";
import Loading from "../../components/ui/Loading";
import {axiosApi, FILE_SERVICE, USER_SERVICE} from "../../http/axios";
import {AuthService} from "../../services/AuthService";

const ProfileImage = (props: { account: Account }) => {

    const fileInput = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string>('');
    const accountId = TokenService.getCurrentAccountId();

    useEffect(() => {
        const imageId = props.account.metadata.find(item => item.key === "account_image")?.value || '';
        if (imageId !== "") {
            const url = `${FILE_SERVICE}/files/${imageId}/data`;
            axiosApi.get<ArrayBuffer>(url, {responseType: 'arraybuffer'})
                .then(response => {
                    const image = FileService.toImage(response.data);
                    setImage(image)
                })
        } else {
            setImage("empty")
        }
    }, [props.account])


    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files!;
        const currentFile = fileList[0];

        const currentImage = await FileService.toBase64fromBlob(currentFile);

        if (currentFile !== undefined) {
            const fileEntity = await FileService.toFile(null, currentFile);
            await axiosApi.patch(`${USER_SERVICE}/accounts/${accountId}/account-image`, fileEntity, {
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`,
                }
            }).then(() => {
                setImage(currentImage);
            })
        }
    }

    const Content = () => {
        if (image === '') {
            return <Loading/>
        } else {
            return (
                <>
                    <Avatar
                        alt="profile"
                        src={image !== 'empty' ? image : DefaultProfileImage}
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
            {Content()}
        </div>
    );
};

export default ProfileImage;
