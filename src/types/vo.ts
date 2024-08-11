import {IUser} from "@/types/user";
import {dayjs} from "element-plus";

export interface engagementVO {
    "id": number,
    "assignmentId": number,
    "studentId": number,
    "score": number,
    "remark": string,
    "fileUrl": string,
    "version": number,
    "status": string,
    "fileKey": string,
}

export interface engagementDetailVO {
    "id": number,
    "assignmentVO": IAssignment,
    "userVO": IUser,
    "score": number|null,
    "remark": string|null,
    "fileUrl": string,
    "version": number,
    "status": string,
    "fileKey": string,
}

export interface IAssignment {
    assignmentId: number;

    assignmentName: string;

    description: string;

    descriptionFile: string|null; // 作业要求，Word/Pdf文件

    attachments: string[]|null; // 作业附件

    teacherId: number; // 发布作业的老师的Id

    courseId: number; // 哪个课程下的assignment

    startTime: string;

    endTime: string;

    createTime: string;

    status: string;
}

export interface AssignmentVO {
    assignmentId: number;

    assignmentName: string;

    description: string;

    descriptionFile: string|null; // 作业要求，Word/Pdf文件

    attachments: string[]|null; // 作业附件

    teacherId: number; // 发布作业的老师的Id

    courseId: number; // 哪个课程下的assignment

    startTime: string;

    endTime: string;

    createTime: string;

    status: string;
}

export interface IAssignmentTableColumn {
    title: string;
    dataIndex: 'desc' | 'publisher' | 'startDate' | 'endDate' | 'details' | 'writing' | 'assignmentId' | 'teacherId';
    key: 'desc' | 'publisher' | 'startDate' | 'endDate' | 'details' | 'writing' | 'assignmentId' | 'teacherId';
}

export interface IAssignmentTableItem {
    desc: string;
    publisher: string;
    startDate: string;
    endDate: string;
    assignmentId: number;
    descriptionFile?: string;
    teacherId: string
}


export interface ITranslationVO {
    queryText: string;

    queryResult: string;

    targetLanguage: string; // 目标语言类型

    queryTime: string;
}

export interface CourseVO {
    courseId: number;
    courseName: string;
    teacherIds: number[];
    courseImages: string[];
    targetGrade: string;
    startTime: string;
    endTime: string;
    createTime: string;
    description: string;
}

