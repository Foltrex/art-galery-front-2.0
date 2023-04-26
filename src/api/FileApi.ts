import {useQuery} from "react-query";
import {EntityFile} from "../entities/entityFile";
import {useDelete, usePost} from "../hooks/react-query";
import {ART_SERVICE, axiosApi} from "../http/axios";


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

export const useDeleteArtFile = () => {
    return useDelete(`${ART_SERVICE}/files`);
}
