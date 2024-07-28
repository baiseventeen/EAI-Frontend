import axiosInstance from "@/apis/axios.config";
import type {IDialogue} from "@/types/dialogue";

const AI_PREFIX = "/api/ai"

const aiApis = {
    getAIDialogues(assignmentId: number, userId: number, page: number=0, size: number=20) {
        return axiosInstance.get(`${AI_PREFIX}`, {
            params: {
                assignmentId,
                userId,
                page,
                size
            }
        })
    },
    getRewriteResult(assignmentId: number, userId: number) {
        return axiosInstance.get(`${AI_PREFIX}/rewrite/result`, {
            params: {
                assignmentId,
                userId
            }
        })
    },
    requestAI(dialogueId: string, model: string, messages: IDialogue[]) {
        return axiosInstance.put(`${AI_PREFIX}`, {
            model: model,
            messages: messages
        }, {
            params: {
                dialogueId: dialogueId
            }
        })
    },
    rewrite(assignmentId: number, userId: number) {
        return axiosInstance.post(`${AI_PREFIX}/rewrite`, {}, {
            params: {
                assignmentId,
                studentId: userId
            }
        })
    }
}

export default aiApis
