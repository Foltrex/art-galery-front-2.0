import {OrganizationStatusEnum} from "../entities/enums/organizationStatusEnum";
import {UseQueryResult} from "react-query/types/react/types";
import {AxiosError} from "axios/index";
import {FILE_SERVICE} from "../http/axios";

export class PrepareDataUtil {

    static getOrganizationStatusColor = (status: OrganizationStatusEnum) => {
        switch (status) {
            case OrganizationStatusEnum.INACTIVE:
                return "red"
            case OrganizationStatusEnum.ACTIVE:
                return "green"
        }
    }

    static getFacilityStatusColor = (isActive: boolean) => {
        return isActive ? 'green' : 'red';
    }
}

export function isQueryError(query:UseQueryResult) {
    return !query.isLoading && !query.isFetching && query.isError;
}
export function getStatus(query:UseQueryResult) {
    return ((query.error) as AxiosError)?.response?.status
}

export function getErrorMessage(e:any):string|undefined {
    //{
    // "timestamp":"2023-04-13T09:14:43.817+00:00",
    // "status":400,
    // "error":"Bad Request",
    // "message":"Validation failed for object='accountDto'. Error count: 1",
    // "errors":[{"codes":["NotEmpty.accountDto.lastName","NotEmpty.lastName","NotEmpty.java.lang.String","NotEmpty"],
    // "arguments":[{"codes":["accountDto.lastName","lastName"],
    // "arguments":null,"defaultMessage":"lastName","code":"lastName"}],
    // "defaultMessage":"must not be empty",
    // "objectName":"accountDto",
    // "field":"lastName",
    // "rejectedValue":null,
    // "bindingFailure":false,
    // "code":"NotEmpty"}],
    // "path":"/accounts/b3fc0646-bbeb-477f-974d-6af91f5033f7"
    // }
    const error = e.response?.data?.error;
    const message = e.response?.data?.message || e.message || '[no error message]';
    return error + "\n " + message
}

export function buildImageUrl(fileId:string) {
    console.log(process.env);
    return process.env.REACT_APP_API_URL + FILE_SERVICE + '/files/' + fileId + '/data'
}