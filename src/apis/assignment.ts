import axiosInstance from "@/apis/axios.config";
import type {AssignmentQuery} from "@/types/query";
import type {AssignmentDTO} from "@/types/dto";

const ASSIGNMENT_PREFIX = "/api/assignment"

const assignmentApis = {
    getAssignmentById(assignmentId: number) {
        return axiosInstance.get(`${ASSIGNMENT_PREFIX}/byAssignment/${assignmentId}`)
    },
    getAssignmentByQuery(query:AssignmentQuery, page: number=0, size: number=10){
        return axiosInstance.post(`${ASSIGNMENT_PREFIX}/query`, {
            ...query
        }, {
            params: {
                page,
                size
            }
        })
    },
    createAssignment(courseId:number, assignmentDTO: AssignmentDTO){
        return axiosInstance.post(`${ASSIGNMENT_PREFIX}`, assignmentDTO, {
            params: {
                courseId
            }
        });
    },
    getAssignmentByCourseId(courseId:number, page: number=0, size: number=10){
        return axiosInstance.get(`${ASSIGNMENT_PREFIX}/byCourse/${courseId}`, {
            params: {
                page,
                size
            }
        })
    },
    updateAssignment(assignmentId:number, assignmentDTO:AssignmentDTO){
        return axiosInstance.put(`${ASSIGNMENT_PREFIX}`, assignmentDTO, {
            params: {
                assignmentId
            }
        })
    }
}

export default assignmentApis
