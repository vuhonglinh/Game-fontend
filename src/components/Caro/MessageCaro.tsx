"use client"

import { MessageCaroType } from "@/@types/caro.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/socket";
import { useEffect, useRef, useState } from "react";

export default function MessageCaro({ room }: { room: string }) {
    const socket = useSocket('caro')
    const [messages, setMessages] = useState<MessageCaroType[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    const sendMessage = () => {
        socket.emit("sendMessage", { roomId: room, message })
    }

    useEffect(() => {
        socket.on(`receiveMessage.${room}`, (data: MessageCaroType) => {
            setMessages((prev) => [...prev, { message: data.message, user: data.user }])
            setMessage(null)
        })

        return () => {
            socket.off(`receiveMessage.${room}`);
        }
    }, [room, socket])



    return (
        <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Trò chuyện</legend>
            <div className="grid gap-3 h-[200px] p-1">
                <ul className="h-full w-full border border-spacing-1 overflow-y-scroll p-1">
                    {messages.map((mess, index) => (
                        <li key={index} className="text-sm">
                            {mess.user.name}: <span className="font-light">{mess.message}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex gap-3">
                <Input
                    id="content"
                    placeholder="Nội dung bình luận"
                    value={message ?? ""}
                    onChange={(e) => setMessage(e.target.value)}
                />
                {message ? (
                    <Button type="submit" onClick={sendMessage}>Gửi</Button>
                ) : (
                    <Button type="submit" disabled>Gửi</Button>
                )}
            </div>
        </fieldset>
    )
}
