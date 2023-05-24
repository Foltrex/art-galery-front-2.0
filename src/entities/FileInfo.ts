
export interface FileInfo {
    id:string;
    mimeType:string;
    contentLength?:number;
    cacheControl?:number;
    originalName?:string;
    directory:string;
    createdAt:Date;

    data?:string;
}