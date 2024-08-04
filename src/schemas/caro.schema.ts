import { z } from "zod";




export const CaroFormSchema = z.object({
    name: z.string().min(5, { message: "Tên phải tối thiểu 5 ký tự" }),
});