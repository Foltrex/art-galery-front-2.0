import {File as FileEntity} from "../entities/file";
import naclUtil from 'tweetnacl-util';
import {AccountEnum} from "../entities/enums/AccountEnum";
import {EntityFile} from "../entities/entityFile";

export class FileService {
    static createImageLinkForAccountType(artId: string, accountType: AccountEnum) {
        return process.env.REACT_APP_PUBLIC_URL + `/gallery/${artId}`;
    }

    static async toFile(artId: string | undefined, file: File): Promise<FileEntity> {
        const arrayBufferFile = await this.toArrayBufferFromBlob(file);
        const binaryFile = new Uint8Array(arrayBufferFile);
        const encodedBase64Image =  naclUtil.encodeBase64(binaryFile);
        
        const fileEnity: FileEntity = {
            id: artId,
            data: encodedBase64Image,
            mimeType: file.type
        };

        return fileEnity;
    }

    static async toEntityFile(entityId: string, file: File): Promise<EntityFile> {
        const arrayBufferFile = await this.toArrayBufferFromBlob(file);
        const binaryFile = new Uint8Array(arrayBufferFile);
        const encodedBase64Image =  naclUtil.encodeBase64(binaryFile);
        
        return {
            entityId: entityId,
            isPrimary: true,
            mimeType: file.type,
            data: encodedBase64Image
        };
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
