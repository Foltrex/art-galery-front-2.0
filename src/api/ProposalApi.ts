import { Proposal } from "../entities/proposal";
import { useCount, useDelete, useLoadMore, usePost } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios"

const PROPOSAL_PAGE_SIZE = 5;

export const useSaveProposal = () => {
    return usePost<Proposal>(`${ART_SERVICE}/proposals`, undefined, { retry: false });
}

export const useDeleteProposal = () => {
    return useDelete(`${ART_SERVICE}/proposals`)
}

export const useCountProposalsByAccountId = (accountId: string) => {
    return useCount(`${ART_SERVICE}/proposals/accounts/${accountId}`);
}

export const useGetProposalPageByAccountId = (accountId: string) => {
    return useLoadMore<Proposal>(`${ART_SERVICE}/proposals/accounts/${accountId}`, {
        size: PROPOSAL_PAGE_SIZE
    })
}