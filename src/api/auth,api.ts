import { AuthType, LoginType, RegisterType, ResponseType } from "@/@types/auth,type";
import http from "@/https/http";


export const authService = {
    login: async (body: LoginType) => {
        return await http.post<ResponseType<AuthType>>("auth/login", body)
    },


    register: async (body: RegisterType) => {
        return await http.post<ResponseType<AuthType>>("auth/register", body)
    },

    logout: async () => {
        return await http.post<ResponseType<AuthType>>("auth/logout")
    }
}