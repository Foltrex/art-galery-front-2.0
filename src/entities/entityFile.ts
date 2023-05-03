import {EntityFileTypeEnum} from "./enums/EntityFileTypeEnum";

export interface EntityFile {
    id?: string;
    entityId?: string;
    originalId?: string;
    isPrimary: boolean;
    type?: EntityFileTypeEnum;
    creationDate: string;
    mimeType: string;
    data: string
}
