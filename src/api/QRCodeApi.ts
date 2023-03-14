import axios from "axios";
import { useQuery } from "react-query";
import { useFetch, usePost } from "../hooks/react-query";

const QR_GENERATOR_API_URL = 'https://api.qrserver.com/v1/create-qr-code';

const fetchQR = (resourceUrl: string) => {
    return axios
        .get<Blob>(QR_GENERATOR_API_URL, {
            params: {
                size: '150x150',
                data: resourceUrl
            },
            responseType: 'blob'
        })
        .then(response => response.data);
}

export const useGenereateQRCode = (resourceUrl: string) => {
    return useQuery<Blob>(
        [
            QR_GENERATOR_API_URL, 
            {
                size: '150x150',
                data: resourceUrl
            }
        ],
        () => fetchQR(resourceUrl)
    );
}