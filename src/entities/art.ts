import { ArtSize } from "./art-size";
import { ArtStyle } from "./art-style";

export interface Art {
    id?: string;
    name: string;
    description: string;
    artistAccountId: string;
    artStyles: ArtStyle[];
    artSize: ArtSize;
    dateCreation: Date; 
}