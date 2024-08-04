"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterFormSchema } from "@/schemas/auth.schema"
import { z } from "zod"
import { RegisterType } from "@/@types/auth,type"
import { authService } from "@/api/auth,api"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { ErrorType } from "@/@types/error"
import { ToastAction } from "@/components/ui/toast"
import { useState } from "react"


export default function RegisterForm() {
    const { toast } = useToast()
    const route = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
        },
    })

    const handleRegister = async (data: RegisterType) => {
        setLoading(true)
        try {
            const res = await authService.register({ ...data })
            toast({
                description: res.data.message,
            })
            setLoading(false)
            route.push('/')
        } catch (errors) {
            const { response } = errors as AxiosError
            if (response?.status === 400) {
                const { message } = response.data as ErrorType
                toast({
                    variant: "destructive",
                    title: "Đăng ký thất bại",
                    description: message[0],
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                })
            }
            setLoading(false)
        }
    }

    return (
        <Card className="mx-auto max-w-sm mt-20">
            <CardHeader>
                <CardTitle className="text-xl">Đăng ký</CardTitle>
                <CardDescription>
                    Nhập thông tin của bạn để tạo tài khoản
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRegister)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nguyen Van A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Tạo tài khoản
                        </Button>
                        <Button type="button" variant="outline" className="w-full">
                            Đăng ký bằng Google
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Bạn đã có tài khoản?{" "}
                    <Link href="/login" className="underline">
                        Đăng nhập
                    </Link>
                </div>
            </CardContent>
        </Card >
    )
}
