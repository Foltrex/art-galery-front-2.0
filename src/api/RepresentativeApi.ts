import {ART_SERVICE, axiosApi, USER_SERVICE} from "../http/axios";
import {Representative} from "../entities/representative";

interface TPageableResponse {
    content: Representative[];

}

export class RepresentativeApi {

    static getAllRepresentative(page?: number, size?: number) {
        return axiosApi.get<any>(`${ART_SERVICE}/representatives`, {
            params: {
                page: page,
                size: size,
            }
        })
    }

    static getAllRepresentativeByOrganizationId(organizationId: string, page?: number, size?: number) {
        return axiosApi.get<any>(`${ART_SERVICE}/representatives/organizations/${organizationId}`, {
            params: {
                page: page,
                size: size,
            }
        }).then(response => response.data)
    }


    static deleteById(id: string) {
        return axiosApi.delete<any>(`${ART_SERVICE}/representatives/${id}`);
    }

    static test2() {
        return axiosApi.post<string>(`${ART_SERVICE}/representatives/post`)
    }

}