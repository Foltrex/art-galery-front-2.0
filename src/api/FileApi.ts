import { useFetch, usePost } from "../hooks/react-query"
import { File } from '../entities/file';
import { axiosApi, FILE_SERVICE } from "../http/axios";
import { QueryFunctionContext, useQuery } from "react-query";

// export const useFetch = <T>(
//     url: string | null,
//     params?: object,
//     config?: UseQueryOptions<T, Error, T, QueryKeyT>
// ) => {
//     const context = useQuery<T, Error, T, QueryKeyT>(
//         [url!, params],
//         context => fetch(context),
//         {
//             enabled: !!url,
//             ...config,
//         }
//     );

//     return context;
// };
type QueryKeyT = [string, object | undefined];

export const fetchImage = (ids?: string[]) => {
    let images: string[] = [];
    ids?.forEach(async (id) => {
        const { data: image } = await axiosApi.get<string>(`${FILE_SERVICE}/files/${id}/data`);
        images.push(image);
    })
    
    return images;
};

export const useGetAllFileStreamByIds = (ids?: string[]) => {
    return useQuery<string[]>(
        [`${FILE_SERVICE}/files/data`, { ids: ids }],
        context => fetchImage(ids),
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