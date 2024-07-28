import axiosInstance from "@/apis/axios.config";

const TEST_PREFIX = "/test"

const testApis = {
    test() {
        return axiosInstance.get(`${TEST_PREFIX}`)
    }
}

export default testApis
