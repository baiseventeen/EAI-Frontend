export interface IUser {
    id: number;
    name: string;
    officialEmail: string;
    officialNumber: string;
    role: "STUDENT"|"TEACHER"|"ADMIN",
    userAvatar: string,
    createTime: string,
    englishName: string,
    gender: "MAN"|"FEMALE"|null,
    birthday: string|null,
    phone: string|null,
    contentEmail: string|null,
}

export interface ILoginUserFrom {
    officialNumber: string;
    password: string;
}
