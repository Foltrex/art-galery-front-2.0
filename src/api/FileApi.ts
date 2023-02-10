import { useFetch, usePost } from "../hooks/react-query"
import { File } from '../entities/file';
import { FILE_SERVICE } from "../http/axios";

export const useGetAllFileStreamByIds = (ids?: string[]) => {
    const idString = ids?.join(', ');
    return useFetch<string[]>(
        `${FILE_SERVICE}/files/data`, 
        { ids: idString },
        !!idString
    );
}

export const useGetAllFileInfosByArtId = (artId?: string) => {
    return useFetch<File[]>(
        `${FILE_SERVICE}/files/arts/${artId}`,
        undefined,
        !!artId
    );
}

export const useGetAllFirstFileInfosByArtIds = (artIds?: string[]) => {
    const artIdString = artIds?.join(', ');
    return useFetch<File[]>(
        `${FILE_SERVICE}/files/arts/first`, 
        { artId: artIdString },
        !!artIdString
    );
}

export const useSaveFile = () => {
    return usePost<File>(`${FILE_SERVICE}/files`);
}