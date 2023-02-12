import { File as FileEntity } from "../entities/file";
import {Buffer} from 'buffer';

export class FileService {
    static async toFile(artId: string, file: File): Promise<FileEntity> {
        const fileData = await file.text();
        const buffer = Buffer.from(fileData);
        const fileEnity: FileEntity = {
            artId: artId,
            data: buffer.toString('base64'),
            mimeType: file.type,
            filename: file.name
        };

        return fileEnity;
    }


    static toBase64(binaryData: ArrayBuffer) {
        return Buffer.from(binaryData).toString('base64');
    }

    static toImage(binaryData: ArrayBuffer, file: FileEntity) {
        return `data:${file.mimeType};base64,` + this.toBase64(binaryData);
    }

    static toBase64fromBlob(blob: Blob) {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
}