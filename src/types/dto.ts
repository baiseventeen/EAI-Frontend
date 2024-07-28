export interface AssignmentDTO {
    assignmentName: string; // 作业名称不能缺失
    description: string; // 作业描述不能缺失
    descriptionFile?: string; // 作业要求，Word/Pdf文件 (可选)
    attachments?: string[]; // 作业附件 (可选)
    startTime: string; // 起始时间不能缺失 (ISO 8601 日期时间字符串)
    endTime: string; // 结束时间不能缺失 (ISO 8601 日期时间字符串)
}

export interface AssignmentQueryDTO {
    assignmentId?: number;
    teacherId?: number;
    courseId?: number;
    assignmentName?: string;
    status?: AssignmentStatus;
}

export interface EnrollDTO {
    studentId:number;
    courseId:number;
    enrollCode:string;
}

export interface CourseDTO {
    courseName: string; // 课程名不能缺失
    teacherIds: number[]; // 老师Id不能缺失
    courseImages?: string[]; // 可选
    targetGrade?: string; // 可选
    startTime: string; // 起始时间不能缺失 (ISO 8601 日期时间字符串)
    endTime: string; // 截止时间不能缺失 (ISO 8601 日期时间字符串)
    description: string; // 课程描述不能缺失
    enrollCode: string; // 选课码不能缺失
}

export interface CourseUpdateDTO {
    courseName: string; // 课程名不能缺失
    teacherIds: number[]; // 老师Id不能缺失
    courseImages?: string[]; // 可选
    targetGrade?: string; // 可选
    startTime: string; // 起始时间不能缺失 (ISO 8601 日期时间字符串)
    endTime: string; // 截止时间不能缺失 (ISO 8601 日期时间字符串)
    description: string; // 课程描述不能缺失
    enrollCode: string; // 选课码不能缺失
}


