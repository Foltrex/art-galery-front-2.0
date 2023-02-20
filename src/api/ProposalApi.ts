import { usePost } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios"

export const useSaveProposal = () => {
    return usePost(`${ART_SERVICE}/proposals`);
}