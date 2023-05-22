import {usePost} from "../hooks/react-query";
import {AxiosError} from "axios";
import {FileInfo} from "../entities/FileInfo";

export const useSaveTempFile = (showError:(error:AxiosError) => void) => {
    return usePost<FileInfo>('files/temp', {}, [], showError)
}