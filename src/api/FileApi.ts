import { useFetch, usePost } from "../hooks/react-query"
import { File } from '../entities/file';
import { axiosApi, FILE_SERVICE } from "../http/axios";
import { QueryFunctionContext, useQuery } from "react-query";

export const fetchImage = (ids?: string[]) => {

    let images: ArrayBuffer[] = [];
    ids?.forEach(async (id) => {
        const { data: image } = await axiosApi.get<ArrayBuffer>(
            `${FILE_SERVICE}/files/${id}/data`,
            { responseType: 'arraybuffer' }
        );

        images.push(image);
    })
    
    return images;
};


export const fetchImages = (ids: string[] = []) => {
    const requests = ids.map(id => {
        const url = `${FILE_SERVICE}/files/${id}/data`;
        return axiosApi.get<ArrayBuffer>(url);
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

export const useGetAllFirstFileInfosByArtIds = (artIds?: string[]) => {
    const artIdString = artIds?.join(', ');
    return useFetch<File[]>(
        `${FILE_SERVICE}/files/arts/first`, 
        { artId: artIdString },
        { enabled: !!artIdString }
    );
}

export const useSaveFile = () => {
    return usePost<File>(`${FILE_SERVICE}/files`);
}