import {ArtSize} from "./art-size";
import {ArtStyle} from "./art-style";
import {EntityFile} from "./entityFile";
import {ArtInfo} from "./artInfo";

export interface Art {
    id?: string;
    name: string;
    description: string;
    price: number;
    artistAccountId: string;
    artStyles: ArtStyle[];
    artSize: ArtSize;
    dateCreation: Date;
    files?: EntityFile[]
    artInfos?: ArtInfo[]
}