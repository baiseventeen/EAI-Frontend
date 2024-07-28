import type {AssignmentCompletionStatus} from "@/types/enums";

export interface CourseQuery {
    courseId:number;
    teacherId:number;
    studentId:number;
    courseName:string;
    semester:string;
}

export interface AssignmentQuery {
    assignmentId:number;
    teacherId:number;
    courseId:number;
    assignmentName:string;
    status:string;
}

export interface EngagementQuery {
    assignmentId: number,
    status?: number
}



