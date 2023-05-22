
export interface FileInfo {
    id:string;
    mimeType:string;
    contentLength?:number;
    cacheControl?:number;
    directory:string;
    createdAt:Date;

    data?:string;
}