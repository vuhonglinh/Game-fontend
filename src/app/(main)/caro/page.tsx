"use client"
import Image from "next/image"
import {
    ListFilter,
    MoreHorizontal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import AddRoom from "@/components/Caro/AddRoom"
import { useEffect, useState } from "react"
import { CaroType } from "@/@types/caro.type"
import { caroService } from "@/api/caro.api"
import { convertDate } from "@/helper/customer"
import { useSocket } from "@/socket"
import Link from "next/link"

export default function ListRooms() {
    const [rooms, setRooms] = useState<CaroType[]>()
    const socket = useSocket('caro');
    useEffect(() => {
        caroService.listRooms().then((res) => {
            setRooms(res.data.data)
        }).catch((err) => { });
    }, [])

    useEffect(() => {
        socket.on('resCreateRoom', (data: CaroType) => {
            setRooms((prev) => [{ ...data }, ...prev || []])
        })

        return () => {
            socket.off('resCreateRoom'); // Unsubscribe khi component unmount
        }
    }, [socket])

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-3">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Lọc phòng
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Lọc bằng</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    Tất cả
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Đủ người
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Thiếu người
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AddRoom />
                    </div>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách phòng</CardTitle>
                            <CardDescription>
                                Bạn chỉ vào được phòng thiếu người không thể vào phòng đủ người.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[100px] sm:table-cell">
                                            <span className="">Ảnh</span>
                                        </TableHead>
                                        <TableHead>Tên phòng</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Số lượng
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Ngày tạo
                                        </TableHead>
                                        <TableHead>
                                            <span className="">Thao tác</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rooms?.map((room) => (
                                        <TableRow key={room._id}>
                                            <TableCell className="hidden sm:table-cell">
                                                {/* <Image
                                                    alt="Product image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src=""
                                                    width="64"
                                                /> */}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {room.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">  {room.users.length <= 2 ? 'Thiếu người' : 'Đủ người'}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {room.users.length}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {convertDate(room.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            {room.users.length <= 2 ? (<Link href={`caro/${room._id}`}>Vào phòng</Link>) : 'Đầy'}
                                                        </DropdownMenuLabel>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                products
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}
