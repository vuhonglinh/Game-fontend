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
import { loginFormSchema, } from "@/schemas/auth.schema"
import { z } from "zod"
import { LoginType } from "@/@types/auth,type"
import { authService } from "@/api/auth,api"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { ToastAction } from "@/components/ui/toast"
import { ErrorType } from "@/@types/error"


export default function LoginForm() {
    const { toast } = useToast()
    const route = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLogin = async (data: LoginType) => {
        setLoading(true)
        try {
            const res = await authService.login({ ...data })
            toast({
                description: res.data.message,
            })
            setLoading(false)
            route.push('/')
        } catch (errors) {
            const { response } = errors as AxiosError

            if (response?.status === 401) {
                const { message } = response.data as ErrorType
                toast({
                    variant: "destructive",
                    title: "Đăng nhập thất bại",
                    description: message,
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                })
            }
            if (response?.status === 400) {
                const { message } = response.data as ErrorType
                toast({
                    variant: "destructive",
                    title: "Đăng nhập thất bại",
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
                <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                <CardDescription>
                    Nhập email của bạn bên dưới để đăng nhập vào tài khoản của bạn
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)}>
                        <div className="grid gap-4">
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
                            {loading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Vui lòng chờ
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full">
                                    Đăng nhập
                                </Button>
                            )}

                            <Button variant="outline" className="w-full">
                                Đăng nhập bằng Google
                            </Button>
                        </div>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Bạn chưa có tài khoản?{" "}
                    <Link href="/register" className="underline">
                        Đăng ký
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
