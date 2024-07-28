import axiosInstance from "@/apis/axios.config";
import type {CourseQuery} from "@/types/query";
import type {AssignmentQueryDTO, CourseDTO, CourseUpdateDTO, EnrollDTO} from "@/types/dto";

const COURSE_PREFIX = "/api/course"

const courseApis = {
    createCourse(courseDTO: CourseDTO){
      return axiosInstance.post(`${COURSE_PREFIX}`, courseDTO)
    },
    getCourseByStudentId(studentId: number, page: number=0, size: number=10){
        return axiosInstance.get(`${COURSE_PREFIX}/byStudent/${studentId}`, {
            params: {
                page,
                size
            }
        })
    },
    getCourseByTeacherId(teacherId: number, page: number=0, size: number=10){
        return axiosInstance.get(`${COURSE_PREFIX}/byTeacher/${teacherId}`, {
            params: {
                page,
                size
            }
        })
    },
    getCourseByCourseId(courseId: number, page: number=0, size: number=10){
        return axiosInstance.get(`${COURSE_PREFIX}/${courseId}`, {
            params: {
                page,
                size
            }
        })
    },
    getAllCourse(courseQuery: CourseQuery, page: number=0, size: number=10){
        return axiosInstance.post(`${COURSE_PREFIX}/query`,courseQuery, {
            params: {
                page,
                size
            }
        })
    },
    enrollCourse(enrollDTO: EnrollDTO){
        return axiosInstance.post(`${COURSE_PREFIX}/enroll`, enrollDTO)
    },
    updateCourse(courseId: number, courseUpdateDTO:CourseUpdateDTO){
        return axiosInstance.put(`${COURSE_PREFIX}`, courseUpdateDTO, {
            params: {
                courseId
            }
        })
    },
    findAssignmentPage: (assignmentQueryDTO: AssignmentQueryDTO, page: number=0, size: number=10) => {
        return axiosInstance.post(`${ASSIGNMENT_PREFIX}/query`, assignmentQueryDTO, {
            params: {
                page,
                size
            }
        });
    }
}

export default courseApis