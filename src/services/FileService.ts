import {File as FileEntity} from "../entities/file";
import naclUtil from 'tweetnacl-util';
import {AccountEnum} from "../entities/enums/AccountEnum";

export class FileService {
    static createImageLinkForAccountType(artId: string, accountType: AccountEnum) {
        switch (accountType) {
            case AccountEnum.ARTIST: {
                return process.env.REACT_APP_PUBLIC_URL + `/arts/artist/${artId}`;
            }
            case AccountEnum.REPRESENTATIVE: {
                return process.env.REACT_APP_PUBLIC_URL + `/arts/representative/${artId}`;
            }
            default: {
                throw new Error('Invalid account type for image\'s url creating')
            }
        }
    }

    static async toFile(artId: string | null, file: File): Promise<FileEntity> {
        const arrayBufferFile = await this.toArrayBufferFromBlob(file);
        const binaryFile = new Uint8Array(arrayBufferFile);
        const encodedBase64Image =  naclUtil.encodeBase64(binaryFile);
        
        const fileEnity: FileEntity = {
            artId: artId,
            data: encodedBase64Image,
            mimeType: file.type,
            filename: file.name
        };

        return fileEnity;
    }

    static toImage(binaryData: ArrayBuffer) {
        const imageData = new Uint8Array(binaryData);

        const data = new Blob([imageData]);
        return URL.createObjectURL(data);
    }

    static toArrayBufferFromBlob(blob: Blob) {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = (error) => reject(error);
        });
    }

    static toBase64fromBlob(blob: Blob) {
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }
}
