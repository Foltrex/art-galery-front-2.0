import {IdentifiableRecord} from "../components/table/Table";

export interface UiError extends IdentifiableRecord {
    id: number
    createdAt?: string
    status?: string
    userId?: string
    url?:string
    errorName?:string
    errorMessage?:string
    errorTrace?:string
    componentStack?:string
}
