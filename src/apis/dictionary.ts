import axiosInstance from "@/apis/axios.config";

const DICT_PREFIX = "/api/translate"

interface dictQueryType {
    q: string;
    from: string;
    to: string;
}

const dictApis = {
    requestDictionary(query: dictQueryType, assignmentId: number, studentId: number) {
        return axiosInstance.post(`${DICT_PREFIX}`, {
            ...query
        }, {
            params: {
                assignmentId,
                studentId
            }
        })
    },
    getTranslations(assignmentId: number, studentId: number) {
        return axiosInstance.get(`${DICT_PREFIX}`, {
            params: {
                assignmentId,
                studentId
            }
        })
    }
}

export default dictApis
