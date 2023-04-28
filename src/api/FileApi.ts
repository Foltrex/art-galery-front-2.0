import {useQuery} from "react-query";
import {EntityFile} from "../entities/entityFile";
import {useDelete, usePost} from "../hooks/react-query";
import {ART_SERVICE, axiosApi} from "../http/axios";


//@TODO Rename later
export const useUploadFile = () => {
    return usePost<EntityFile>(`${ART_SERVICE}/files/upload`);
}

export const uploadArtFile = (artId:string, data:EntityFile) => {
    return axiosApi.post<EntityFile>(`${ART_SERVICE}/arts/${artId}/image`, data);
}

export const useNewSaveFile = () => {
    return usePost<EntityFile>(`${ART_SERVICE}/files`)
}

/**
 * @param incrementalKey - key for query refresh, in case if one of images from collection was deleted
 * @param entityId
 */
export const useGetAllEntityFilesByEntityId = (incrementalKey:number, entityId?: string) => {
    const path = `${ART_SERVICE}/files`;
    return useQuery<EntityFile[]>(
        [path, { entityId: entityId, key: incrementalKey }],
        () => axiosApi.get<EntityFile[]>(path, {
            params: {entityId: entityId}
        }).then(response => response.data),
        { enabled: !!entityId}
    )
}

export const useDeleteArtFile = () => {
    return useDelete(`${ART_SERVICE}/files`);
}
