import axiosInstance from "@/apis/axios.config";

const EDITOR_PREFIX = "/api/onlyoffice"

const editorApis = {
    triggerForceSave(fileKey: string) {
        return axiosInstance.post(`${EDITOR_PREFIX}/forcesave`, {
            "c": "forcesave",
            "key": fileKey
        })
    }
}

export default editorApis
