import {OrganizationStatusEnum} from "../entities/enums/organizationStatusEnum";

export class PrepareDataUtil {

    static getOrganizationStatusColor = (status: OrganizationStatusEnum) => {
        switch (status) {
            case OrganizationStatusEnum.INACTIVE:
                return "red"
            case OrganizationStatusEnum.NEW:
                return "orange"
            case OrganizationStatusEnum.ACTIVE:
                return "green"
        }
    }
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