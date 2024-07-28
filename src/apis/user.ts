import axiosInstance from "@/apis/axios.config";
import { type ILoginUserFrom } from "@/types/user";

const USER_PREFIX = "/api/user"

const userApis = {
    login: (userForm: ILoginUserFrom) => {
        return axiosInstance.post(`${USER_PREFIX}/login`, {
            ...userForm
        })
    },
    findUserById: (id:number) => {
        return axiosInstance.get(`${USER_PREFIX}`, {
            params: {
                id
            }
        })
    }
}

export default userApis
