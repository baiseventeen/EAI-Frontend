import axiosInstance from "@/apis/axios.config";
//提交的后端路径
const ENGAGE_PREFIX = "/api/assignment/engage"

const engagementApis = {
    engageAssignment(assignmentId:number){
        return axiosInstance.post(ENGAGE_PREFIX, {}, {
            params: {
                assignmentId
            }
        })
    },
    getEngagement: (studentId: number, assignmentId: number) => {
        return axiosInstance.get(ENGAGE_PREFIX, {
            params: {
                studentId,
                assignmentId
            }
        })
    },
    getDetailEngagement: (studentId: number, assignmentId: number) => {
        return axiosInstance.get(ENGAGE_PREFIX+"/detail", {
            params: {
                studentId,
                assignmentId
            }
        })
    },
    // 提交作业
    engagementSubmit: (studentId: number, assignmentId: number) => {
        return axiosInstance.put(ENGAGE_PREFIX+"/submit", {}, {
            params: {
                studentId,
                assignmentId
            }
        })
    },
    // 暂存作业
    engagementStage: (studentId: number, assignmentId: number) => {
        return axiosInstance.put(ENGAGE_PREFIX+"/stage", {}, {
            params: {
                studentId,
                assignmentId
            }
        })
    },
    //提交批改
    engagementCorrect: (studentId: number, assignmentId: number, correctDTO: {score: number, remark: string}) => {
        return axiosInstance.put(`${ENGAGE_PREFIX}/correct`, correctDTO, {
            params: {
                studentId,
                assignmentId
            }
        })
    },
    getEngagementByAssignmentId(assignmentId:number, page: number=0, size: number=10){
        return axiosInstance.post(`${ENGAGE_PREFIX}/query`, {

        }, {
            params: {
                page,
                size,
                assignmentId
            }
        })
    }
}

export default engagementApis
