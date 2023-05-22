import axios from "axios";
import {Cookies} from "react-cookie";

const X_TOTAL_COUNT_HEADER: string = "X-Total-Count";
export let axiosApi = axios.create({baseURL: process.env.REACT_APP_API_URL})

axiosApi.interceptors.request.use(request => {
    const cookies = new Cookies();
    const jwtTokenCookiesKey = "token";
    const token = cookies.get(jwtTokenCookiesKey);
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
}, (error) => {
    console.log('REQUEST ERROR: ' + error)
    return Promise.reject(error);
})

axiosApi.interceptors.response.use(response => {
        return response;
    },
    (error) => {
        console.log('RESPONSE ERROR: ' + error)
        return Promise.reject(error);
    }
)

axiosApi.defaults.headers.head['Access-Control-Expose-Headers'] = X_TOTAL_COUNT_HEADER;
