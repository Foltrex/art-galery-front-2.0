import {Proposal} from "../entities/proposal";
import {IPage, useCount, useDelete, useFetch, usePost} from "../hooks/react-query"
import {AxiosError} from "axios";

export const useCreateProposal = (showError:(error:AxiosError) => void) => {
    return usePost<Proposal>('proposals', {}, ['GET:proposals', 'GET:proposals/count', 'GET:proposals/id'], showError, { retry: false });
}

export const useDeleteProposal = (showError:(error:AxiosError) => void) => {
    return useDelete('proposals', {}, ['GET:proposals'], showError, { retry: false })
}

interface ProposalFilter {
    page: number,
    size: number,
    accountId?: string,
    facilityId?: string,
    organizationId?: string
}

export const useGetCount = (filter: ProposalFilter, showError:(error:AxiosError) => void) => {
    return useCount('proposals', 'GET:proposals/count', filter, showError);
}

export const useGetProposals = (filter: ProposalFilter, showError:(error:AxiosError) => void) => {
    return useFetch<{sent:IPage<Proposal>, received: IPage<Proposal>, approved: IPage<Proposal>}>('proposals/', 'GET:proposals', filter, showError)
}