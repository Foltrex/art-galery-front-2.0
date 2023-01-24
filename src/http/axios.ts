import axios from "axios";

export const ART_SERVICE = "art-service"
export const USER_SERVICE = "user-service"
export const FILE_SERVICE = "file-service"

export let axiosApi = axios.create({baseURL: `http://localhost:8080/`})

axiosApi.interceptors.request.use(request => {
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
