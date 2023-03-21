import axios from "axios";

export const ART_SERVICE = "art-service"
export const USER_SERVICE = "user-service"
export const FILE_SERVICE = "file-service"

const X_TOTAL_COUNT_HEADER: string = "X-Total-Count";

let axiosApiTemp = axios.create({baseURL: `http://localhost:8080/`})
if (process.env.NODE_ENV === "production") {
    axiosApiTemp = axios.create({baseURL: `${document.location.protocol}//${document.location.hostname}/apigateway/`});
}
export const axiosApi = axiosApiTemp;

// export let axiosApi = axios.create({baseURL: `http://localhost:8080/`})

// export let axiosApi = axios.create({baseURL: `http://46.101.136.62/8080`})

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

axiosApi.defaults.headers.head['Access-Control-Expose-Headers'] = X_TOTAL_COUNT_HEADER;
