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
}