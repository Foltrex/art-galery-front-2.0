import {EntityFileTypeEnum} from "./enums/EntityFileTypeEnum";

export interface EntityFile {
    id?: string;
    entityId: string,
    originalId: string,
    "isPrimary": true,
    "type": EntityFileTypeEnum,
    "creationDate": Date
}
