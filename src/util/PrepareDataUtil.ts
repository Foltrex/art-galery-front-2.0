import {OrganizationStatusEnum} from "../entities/enums/organizationStatusEnum";
import {UseMutationResult, UseQueryResult} from "react-query/types/react/types";
import {AxiosError} from "axios/index";
import {EntityFile} from "../entities/entityFile";
import {FileService} from "../services/FileService";
import React from "react";
import {AxiosResponse} from "axios";
import {FileInfo} from "../entities/FileInfo";

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

export function buildImageUrl(fileId:string) {
    return process.env.REACT_APP_API_URL + 'files/' + fileId + '/data'
}


export function compareFiles(a: EntityFile, b: EntityFile) {
    if (a.isPrimary) {
        return -1;
    }
    if (b.isPrimary) {
        return 1;
    }
    return new Date(a.creationDate).getTime() > new Date(b.creationDate).getTime() ? 1 : -1;
}

export function uploadTempFile(e: React.ChangeEvent<HTMLInputElement>, saveFile: UseMutationResult<AxiosResponse<FileInfo, any>, AxiosError<unknown, any>, FileInfo, unknown>) {
    const fileList = e.target.files!;
    const file = fileList[0];
    return FileService
        .toBase64fromBlob(file)
        .then(image => {
            return saveFile.mutateAsync({
                id: '',
                directory: '',
                originalName: file.name,
                createdAt: new Date(),
                mimeType: file.type,
                data: image
            });
        });
}