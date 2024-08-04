"use client"
import { ErrorType } from '@/@types/error'
import { authService } from '@/api/auth,api'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { AxiosError } from 'axios'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Logout() {
    const { toast } = useToast()
    const route = useRouter()

    const handleLogout = async () => {
        try {
            const res = await authService.logout();
            toast({
                description: res.data.message
            })
            route.push("/login")
        } catch (errors) {
            const { response } = errors as AxiosError
            if (response?.status === 400) {
                const { message } = response.data as ErrorType
                toast({
                    variant: "destructive",
                    title: "Đăng nhập thất bại",
                    description: message[0],
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                })
            }
        }
    }


    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
        >
            <LogOut className="size-3.5" />
            Đăng xuất
        </Button>
    )
}
