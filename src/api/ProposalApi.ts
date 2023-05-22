import {Proposal} from "../entities/proposal";
import {useCount, useDelete, useLoadMore, usePost} from "../hooks/react-query"
import {AxiosError} from "axios";

const PROPOSAL_PAGE_SIZE = 5;

export const useSaveProposal = (showError:(error:AxiosError) => void) => {
    return usePost<Proposal>('proposals', {}, ['GET:proposals'], showError, { retry: false });
}

export const useDeleteProposal = (showError:(error:AxiosError) => void) => {
    return useDelete('proposals', {}, ['GET:proposals'], showError, { retry: false })
}

export const useCountProposalsByAccountId = (accountId: string) => {
    return useCount('proposals/accounts/' + accountId);
}

export const useGetProposalPageByAccountId = (accountId: string, showError:(error:AxiosError) => void) => {
    return useLoadMore<Proposal>('proposals/accounts/' + accountId, 'GET:proposals', {
        size: PROPOSAL_PAGE_SIZE
    }, showError)
}