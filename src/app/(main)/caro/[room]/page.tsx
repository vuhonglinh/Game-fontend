"use client";
import { UserType } from "@/@types/auth,type";
import { CaroType } from "@/@types/caro.type";
import MessageCaro from "@/components/Caro/MessageCaro";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/ContextProvider";
import { useSocket, useSocketRoom } from "@/socket";
import { useEffect, useState } from "react";

const Umbrella = 10;
const Default = 5;

export default function RoomCaro({ params }: { params: { room: string } }) {
    const { room } = params;
    const { user } = useAppContext();

    if (!room || !user) return null;

    const { toast } = useToast();
    const socket = useSocket('caro');
    const { users } = useSocketRoom('caro', room, user);
    const [doashboards, setDoashboard] = useState<Array<Array<string | null>>>(
        Array(Umbrella).fill(null).map(() => Array(Umbrella).fill(null))
    );
    const [actor, setActor] = useState<string>("X");
    const [winner, setWinner] = useState<string | null>(null);

 
    const checkWinner = (): boolean => {
        const check = (a: string | null, b: string | null, c: string | null, d: string | null, e: string | null) => {
            return a !== null && a === b && a === c && a === d && a === e;
        };

        // Kiểm tra hàng ngang
        for (let row = 0; row < Umbrella; row++) {
            for (let col = 0; col <= Umbrella - Default; col++) {
                if (check(
                    doashboards[row][col],
                    doashboards[row][col + 1],
                    doashboards[row][col + 2],
                    doashboards[row][col + 3],
                    doashboards[row][col + 4]
                )) {
                    return true;
                }
            }
        }

        // Kiểm tra hàng dọc
        for (let col = 0; col < Umbrella; col++) {
            for (let row = 0; row <= Umbrella - Default; row++) {
                if (check(
                    doashboards[row][col],
                    doashboards[row + 1][col],
                    doashboards[row + 2][col],
                    doashboards[row + 3][col],
                    doashboards[row + 4][col]
                )) {
                    return true;
                }
            }
        }

        // Kiểm tra đường chéo (\)
        for (let row = 0; row <= Umbrella - Default; row++) {
            for (let col = 0; col <= Umbrella - Default; col++) {
                if (check(
                    doashboards[row][col],
                    doashboards[row + 1][col + 1],
                    doashboards[row + 2][col + 2],
                    doashboards[row + 3][col + 3],
                    doashboards[row + 4][col + 4]
                )) {
                    return true;
                }
            }
        }

        // Kiểm tra đường chéo (/)
        for (let row = 0; row <= Umbrella - Default; row++) {
            for (let col = Default - 1; col < Umbrella; col++) {
                if (check(
                    doashboards[row][col],
                    doashboards[row + 1][col - 1],
                    doashboards[row + 2][col - 2],
                    doashboards[row + 3][col - 3],
                    doashboards[row + 4][col - 4]
                )) {
                    return true;
                }
            }
        }
        return false;
    };

    useEffect(() => {
        const handleCheck = ({ room, rowIndex, colIndex, userRes }: { room: string, rowIndex: number, colIndex: number, userRes: UserType }) => {
            if (doashboards[rowIndex][colIndex] || winner) return;

            const newBoard = doashboards.map(row => row.slice());
            newBoard[rowIndex][colIndex] = actor;
            setDoashboard(newBoard);

            // Chỉ cập nhật actor nếu không có người thắng
            if (!checkWinner()) {
                setActor((prevActor) => prevActor === 'X' ? 'O' : 'X');
            }
        };

        socket.on('handleCheck', handleCheck);

        return () => {
            socket.off('handleCheck', handleCheck);
        };
    }, [doashboards, winner, actor, socket]);

    useEffect(() => {
        if (checkWinner()) {
            toast({
                description: `${actor === 'X' ? 'O' : 'X'} đã chiến thắng`
            });
            setWinner(actor);
        }
    }, [doashboards, actor]);

    return (
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div
                className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
                <div className="grid w-full items-start gap-6">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Game Caro
                        </legend>
                        <div className="grid gap-3 h-[240px]">
                            Số người trong phòng là : {users.length}
                        </div>
                    </fieldset>
                    <MessageCaro room={room} />
                </div>
            </div>
            <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                <div>
                    <h1 className="text-left font-bold size-10 w-full text-black pl-2">Game Caro</h1>
                    {winner ? (
                        <span className="text-black pl-2">Người thắng: {winner}</span>
                    ) : (
                        <span className="text-black pl-2">Lượt: {actor}</span>
                    )}
                </div>
                <div className="h-full flex justify-center items-center">
                    <div>
                        {doashboards.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {row.map((col, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => socket.emit("playChess", { room, rowIndex, colIndex })}
                                        className="text-black h-[40px] w-[40px] border border-solid border-black cursor-pointer flex justify-center items-center"
                                    >
                                        {col}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
