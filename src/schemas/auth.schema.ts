import { z } from "zod";


export const loginFormSchema = z.object({
    email: z.string({ message: "Email không được để trống" }).email({ message: "Email không đúng định dạng" }),
    password: z.string().min(5, { message: "Mật khẩu phải tối thiểu 5 ký tự" }),
});




export const RegisterFormSchema = z.object({
    name: z.string().min(5, { message: "Tên phải tối thiểu 5 ký tự" }),
    email: z.string().email({ message: "Email không đúng định dạng" }),
    password: z.string().min(5, { message: "Mật khẩu phải tối thiểu 5 ký tự" }),
});