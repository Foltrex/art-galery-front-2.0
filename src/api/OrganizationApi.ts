import {Organization} from "../entities/organization";
import {IPage, useFetch, useUpdate} from "../hooks/react-query";
import {ART_SERVICE} from "../http/axios";
import {Representative} from "../entities/representative";

const API = `${ART_SERVICE}/organizations`;

export const useGetAllOrganizations = (params:{page:number, size:number, id?: string}) => {
    return useFetch<IPage<Organization>>(
        `${API}`,
        params,
        { enabled: true, retry: false }
    );
}

export const useGetOrganizationById = (id?: string) => {
    return useFetch<Organization>(
        `${ART_SERVICE}/organizations/${id}`,
        undefined,
        { enabled: !!id, retry: false }
    );
}


export const useUpdateOrganizationById = (organizationId: string) => {
    return useUpdate<Organization>(`${API}/${organizationId}`);
}
