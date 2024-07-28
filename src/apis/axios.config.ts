import axios from "axios";

// const BASEURL = 'http://47.111.23.171:8081'
// const BASEURL = 'http://localhost:8080'
const BASEURL = 'http://8.130.126.86:8080'

const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

//请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        // const token = JSON.parse(sessionStorage.getItem('user-storage') as string).state.token
        let token = null
        if(sessionStorage.getItem('user-storage')){
            token = JSON.parse(sessionStorage.getItem('user-storage') as string).token
        }

        // 如果存在token，则每次请求前加入到请求头中
        if (token) config.headers["Authorization"] = token
        return config

        // let token = null;
        //
        // if(localStorage.getItem('Authorization')){
        //     token = localStorage.getItem('Authorization');
        // }
        // // 如果存在token，则每次请求前加入到请求头中
        // if (token) config.headers["Authorization"] = token
        // return config
    },
    error => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    response => {
        // if (response.data.code === 200) {
        //     return response.data.data as any
        // }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default axiosInstance
