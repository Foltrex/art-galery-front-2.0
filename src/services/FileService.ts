import { File as FileEntity } from "../entities/file";
import {Buffer} from 'buffer';
import naclUtil from 'tweetnacl-util';
import { decode } from "base64-arraybuffer";

export class FileService {
    static async toFile(artId: string, file: File): Promise<FileEntity> {
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