"use client"
import MessageCaro from '@/components/Caro/MessageCaro';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/ContextProvider';
import { cn } from '@/lib/utils';
import { useSocketRoom } from '@/socket';
import { useEffect, useState } from 'react';

const SNAKE_SPEED = 100; // Milliseconds per move
const BOARD_SIZE = 20; // 20x20 grid

interface Point {
    x: number;
    y: number;
}

const getRandomPosition = (): Point => ({
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
});

export default function SnakeGame() {
    const {toast} = useToast()
    const { user } = useAppContext()
    if (user === null) return
    const { users } = useSocketRoom("caro", 'snake', user)
    // Tọa độ của rắn
    const [snake, setSnake] = useState<Point[]>([{ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 }]);

    // Hướng đi
    const [direction, setDirection] = useState<Point>({ x: 0, y: 1 });

    // Tọa độ của mồi
    const [bait, setBait] = useState<Point>(getRandomPosition());

    // Trạng thái game over
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': // Lên trên
                    setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowDown': // Xuống dưới
                    setDirection({ x: 1, y: 0 });
                    break;
                case 'ArrowLeft': // Sang trái
                    setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowRight': // Sang phải
                    setDirection({ x: 0, y: 1 });
                    break;
            }
        };
        // Đăng ký sự kiện keydown
        window.addEventListener('keydown', handleKeyDown);

        // Dọn dẹp sự kiện khi component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    useEffect(() => {
        const onGame = () => {
            if (isGameOver) return

            const newSnake = [...snake]
            const head = {
                x: newSnake[0].x + direction.x,
                y: newSnake[0].y + direction.y,
            }

            if (head.x > BOARD_SIZE || head.x < 0 || head.y > BOARD_SIZE || head.y < 0 || newSnake.some((item) => item.x === head.x && item.y === head.y)) {
                toast({
                    variant: "destructive",
                    title: "Ồ không! Bạn đã thua rồi.",
                    description: "Hãy tiến tục thử lại nhé.",
                    action: <ToastAction onClick={handleRestart} altText="Try again">Chơi lại</ToastAction>,
                })
                setIsGameOver(true)
            }

            // Thêm vị trí đầu rắn mới vào đầu mảng newSnake, di chuyển cả chuỗi rắn về phía trước.
            newSnake.unshift(head)

            if (bait.x === head.x && bait.y === head.y) {
                setBait(getRandomPosition)
            } else {
                newSnake.pop()
            }

            setSnake(newSnake)
        }

        const interval = setInterval(onGame, SNAKE_SPEED)
        return () => {
            clearInterval(interval)
        }
    }, [bait, snake, direction])

    const handleRestart = () => {
        setIsGameOver(false)
        setBait(getRandomPosition())
        setSnake([{ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 }])
        setDirection({ x: 0, y: 1 })
    }

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
                        <div className="h-[180px]">
                            <p>Số người trong phòng là : {users.length}</p>
                            <p>Điểm số : {snake.length}</p>
                        </div>
                        <Button className='' onClick={handleRestart}>Chơi lại</Button>
                    </fieldset>
                    <MessageCaro room={"snake"} />
                </div>
            </div>
            <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">

                <div>
                    <h1 className="text-left font-bold size-10 w-full text-black pl-2">Rắn săn mồi</h1>

                    <span className="text-black pl-2"></span>

                </div>
                <div className="h-full flex justify-center items-center">
                    <div>
                        {
                            Array.from({ length: BOARD_SIZE }).map((_, rowIndex) => (
                                <div key={rowIndex} className='flex'>
                                    {Array.from({ length: BOARD_SIZE }).map((_, colIndex) => {
                                        const isBait = bait.x === rowIndex && bait.y === colIndex;
                                        const isSnake = snake.find((s) => s.x === rowIndex && s.y === colIndex)

                                        return (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                className={cn(`h-[20px] w-[20px] border border-spacing-0 border-black`, {
                                                    'bg-red-700': isBait,
                                                    'bg-green-500': isSnake,
                                                })}
                                            >
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}




