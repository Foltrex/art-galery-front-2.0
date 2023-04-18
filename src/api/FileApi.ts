import {useQuery} from "react-query";
import {EntityFile} from "../entities/entityFile";
import {File} from '../entities/file';
import {useDelete, useFetch, usePost} from "../hooks/react-query";
import {ART_SERVICE, axiosApi, FILE_SERVICE} from "../http/axios";


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
        [`${FILE_SERVICE}/files/data`, {ids: ids}],
        () => fetchImages(ids), 
        {
            enabled: !!ids
        }
    );
}

export const useGetFileStreamById = (id?: string) => {
    return useFetch<ArrayBuffer>( `${FILE_SERVICE}/files/${id}/data`, undefined, {
        enabled: !!id
    });
}

export const useGetAllFileInfosByArtId = (artId?: string) => {
    return useFetch<File[]>(
        `${FILE_SERVICE}/files/arts/${artId}`,
        undefined,
        {enabled: !!artId}
    );
}

//@TODO Remove
export const useSaveFile = () => {
    return usePost<File>(`${FILE_SERVICE}/files`);
}

//@TODO Rename later
export const useUploadFile = () => {
    return usePost<EntityFile>(`${ART_SERVICE}/files/upload`);
}

export const useNewSaveFile = () => {
    return usePost<EntityFile>(`${ART_SERVICE}/files`)
}

export const useGetAllEntityFilesByEntityId = (entityId?: string) => {
    const path = `${ART_SERVICE}/files`;
    return useQuery<EntityFile[]>(
        [path, { entityId: entityId }],
        () => axiosApi.get<EntityFile[]>(path, {
            params: {entityId: entityId}
        }).then(response => response.data),
        { enabled: !!entityId }
    )
}

export const useDeleteFile = () => {
    return useDelete(`${FILE_SERVICE}/files`);
}
