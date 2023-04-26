import naclUtil from 'tweetnacl-util';
import {EntityFile} from "../entities/entityFile";
import {EntityFileTypeEnum} from "../entities/enums/EntityFileTypeEnum";

export class FileService {

    static toEntityFile(entityId: string, file: File): Promise<EntityFile> {
        return this.toArrayBufferFromBlob(file)
            .then(arrayBufferFile => {
                const binaryFile = new Uint8Array(arrayBufferFile);
                const encodedBase64Image =  naclUtil.encodeBase64(binaryFile);
                return {
                    entityId: entityId,
                    originalId: undefined,
                    isPrimary: true,
                    type: EntityFileTypeEnum.ORIGINAL,
                    creationDate: new Date(),
                    mimeType: file.type,
                    data: encodedBase64Image
                };
            });
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
