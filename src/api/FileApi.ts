import { useDelete, useFetch, usePost } from "../hooks/react-query"
import { File } from '../entities/file';
import { axiosApi, FILE_SERVICE } from "../http/axios";
import { QueryFunctionContext, useQuery } from "react-query";


export const fetchImages = (ids: string[] = []) => {
    const requests = ids.map(id => {
        const url = `${FILE_SERVICE}/files/${id}/data`;
        return axiosApi.get<ArrayBuffer>(url, {responseType: 'arraybuffer'});
    })

    return Promise.all(requests)
        .then(responses => responses.map(response => response.data));
};

export const useGetAllFileStreamByIds = (ids?: string[]) => {
    return useQuery<ArrayBuffer[]>(
        [`${FILE_SERVICE}/files/data`, { ids: ids }],
        context => fetchImages(ids),
    );
}

export const useGetAllFileInfosByArtId = (artId?: string) => {
    return useFetch<File[]>(
        `${FILE_SERVICE}/files/arts/${artId}`,
        undefined,
        { enabled: !!artId }
    );
}

export const useSaveFile = () => {
    return usePost<File>(`${FILE_SERVICE}/files`);
}

export const useDeleteFile = () => {
    return useDelete(`${FILE_SERVICE}/files`);
}