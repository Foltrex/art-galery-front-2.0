import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds } from "../../api/FileApi";
import { FileService } from "../../services/FileService";

type QueryResultT = {
    data: string | undefined;
    isLoading: boolean;
    isFetched: boolean;
    isError: boolean;
}

export const useGetArtListItemImageByArtId = (artId?: string): QueryResultT => {
    const { data: files } = useGetAllFileInfosByArtId(artId);

    let fileIds: string[] = [];
    if (files) {
        files.forEach(file => {
            if (file.id) {
                fileIds.push(file.id);
            }
        })
    }

    const { 
        data: imagesData, 
        isLoading, 
        isFetched, 
        isError 
    } = useGetAllFileStreamByIds(fileIds);

    const firstImageData = imagesData?.at(0);
    const image = firstImageData
        ? FileService.toImage(firstImageData)
        : undefined;

    const result: QueryResultT = {
        data: image,
        isLoading: isLoading,
        isFetched: isFetched,
        isError: isError
    };

    return result;
}