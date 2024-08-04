import { UserType } from "@/@types/auth,type";



export type CaroType = {
    _id: string;
    name: string;
    users: UserType[]
    createdBy: UserType;
    createdAt: Date;
    updatedAt: Date;
}


export type FormCaroType = {
    name: string,
}


export type MessageCaroType = {
    message: string,
    user: UserType
}