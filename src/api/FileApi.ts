import {useDelete, useFetch, usePost} from "../hooks/react-query"
import {File} from '../entities/file';
import {ART_SERVICE, axiosApi, FILE_SERVICE} from "../http/axios";
import {useQuery} from "react-query";
import {EntityFile} from "../entities/entityFile";
import { useUpdate } from "../hooks/react-query";


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
        () => fetchImages(ids), {
            // enabled: ids !== undefined
        }
    );
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
export const useNewSaveFile = () => {
    return usePost<EntityFile>(`${ART_SERVICE}/files`);
}

export const useGetAllEntityFilesByEntityId = (entityId?: string) => {
    return useFetch<EntityFile[]>(`${ART_SERVICE}/files`, {
        entityId: entityId
    }, {
        enabled: !!entityId
    });
}

// export const useUpdateFile = () => {
//     return useUpdate(`${ART_SERVICE}/files`)
// }

export const useDeleteFile = () => {
    return useDelete(`${FILE_SERVICE}/files`);
}
