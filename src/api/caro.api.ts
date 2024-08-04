

import { ResponseType } from "@/@types/auth,type";
import { CaroType, FormCaroType } from "@/@types/caro.type";
import http from "@/https/http";


export const caroService = {
    listRooms: async () => {
        return await http.get<ResponseType<CaroType[]>>("caro")
    },


    createRoom: async (body: FormCaroType) => {
        return await http.post<ResponseType<CaroType>>("caro", body)
    },

}