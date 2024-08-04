import { AxiosResponse } from "axios";

export type LoginType = {
    email: string;
    password: string;
}

export type AuthType = {
    accessToken: string;
    refreshToken: string;
    user: UserType;
}

export type RegisterType = {
    name: string;
    email: string;
    password: string;
}


export type ResponseType<T> = {
    data: T,
    message: string;
    statusCode: number
}

export type UserType = {
    _id: string;
    name: string;
    email: string;
}