"use client"
import { CaroType, FormCaroType } from "@/@types/caro.type"
import { ErrorType } from "@/@types/error"
import { caroService } from "@/api/caro.api"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { CaroFormSchema } from "@/schemas/caro.schema"
import { useSocket } from "@/socket"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { Loader2, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"



export default function AddRoom() {
    const { toast } = useToast()
    const route = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof CaroFormSchema>>({
        resolver: zodResolver(CaroFormSchema),
        defaultValues: {
            name: ""
        },
    })




    const onSubmit = async (data: FormCaroType) => {
        setLoading(true)
        useSocket('caro').emit("addRoom", data, (res: CaroType) => {
            toast({
                description: "Tạo mới phòng thành công"
            })
            setLoading(false)
            route.push(`/caro/${res._id}`)
        })
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Thêm mới phòng
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tọa mới phòng</DialogTitle>
                    <DialogDescription>
                        Phòng sẽ bị xóa nếu không có người.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên phòng</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên phòng" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {loading ? (
                            <Button disabled className="w-full">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Vui lòng chờ
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full">Thêm mới</Button>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
