"use client"
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Book, Bot, Code2, LifeBuoy, Settings2, SquareTerminal, SquareUser, Triangle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function SidebarMain(route: any) {
    const isActive = usePathname()
    return (
        <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
                <Button variant="outline" size="icon" aria-label="Home">
                    <Link href={'/'}>
                        <Triangle className="size-5 fill-foreground" />
                    </Link>
                </Button>
            </div>
            <nav className="grid gap-1 p-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={'/caro'}
                            className={cn("flex justify-center py-3 items-center rounded-lg ", {
                                "bg-slate-300": isActive == "/caro"
                            })}
                            aria-label=" Game Caro"
                        >
                            <SquareTerminal className="size-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Game Caro
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={'/snake'}
                            className={cn("flex justify-center py-3 items-center rounded-lg ", {
                                "bg-slate-300": isActive == "/snake"
                            })}
                            aria-label="Game rắn săn mồi"
                        >
                            <Bot className="size-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Game rắn săn mồi
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={'/puzzle'}
                            className={cn("flex justify-center py-3 items-center rounded-lg ", {
                                "bg-slate-300": isActive == "/puzzle"
                            })}
                            aria-label="Game xếp hình"
                        >
                            <Code2 className="size-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Game xếp hình
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            aria-label="Documentation"
                        >
                            <Book className="size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Documentation
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            aria-label="Settings"
                        >
                            <Settings2 className="size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Settings
                    </TooltipContent>
                </Tooltip>
            </nav>
            <nav className="mt-auto grid gap-1 p-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mt-auto rounded-lg"
                            aria-label="Help"
                        >
                            <LifeBuoy className="size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Help
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mt-auto rounded-lg"
                            aria-label="Account"
                        >
                            <SquareUser className="size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Account
                    </TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    )
}
