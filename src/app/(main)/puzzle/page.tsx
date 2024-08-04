"use client"
import { useSocket } from '@/socket';
import { useEffect, useState } from 'react';


const BoardSize = 15; // Kích thước của bàn cờ

const HomePage = () => {
    const socket = useSocket("game");
    const [board, setBoard] = useState<string[][]>(Array(BoardSize).fill(Array(BoardSize).fill('')));
    const [roomId, setRoomId] = useState<string>('');
    const [player, setPlayer] = useState<'X' | 'O'>('X');

    useEffect(() => {
        socket.on('moveMade', (data: { x: number; y: number; player: string }) => {
            const newBoard = board.map(row => [...row]);
            newBoard[data.x][data.y] = data.player;
            setBoard(newBoard);
        });

        socket.on('playerJoined', (data: { message: string }) => {
            console.log(data.message);
        });

        socket.on('playerLeft', (data: { message: string }) => {
            console.log(data.message);
        });

        return () => {
            socket.off('moveMade');
            socket.off('playerJoined');
            socket.off('playerLeft');
        };
    }, [board]);

    const handleCellClick = (x: number, y: number) => {
        if (board[x][y] === '') {
            socket.emit('makeMove', { roomId, x, y, player });
            const newBoard = board.map(row => [...row]);
            newBoard[x][y] = player;
            setBoard(newBoard);
            setPlayer(player === 'X' ? 'O' : 'X');
        }
    };

    const joinRoom = () => {
        if (roomId) {
            socket.emit('joinRoom', roomId);
        }
    };

    const leaveRoom = () => {
        if (roomId) {
            socket.emit('leaveRoom', roomId);
        }
    };

    // Kiểm tra cấu trúc của board
    const isValidBoard = Array.isArray(board) && board.every(row => Array.isArray(row) && row.length === board[0].length);
    if (!isValidBoard) {
        return <div>Error: Invalid board state</div>;
    }

    return (
        <div>
            <h1>Caro Game</h1>
            <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
            />
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={leaveRoom}>Leave Room</button>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${BoardSize}, 30px)` }}>
                {board.map((row, x) => (
                    row.map((cell, y) => (
                        <div
                            key={`${x}-${y}`}
                            onClick={() => handleCellClick(x, y)}
                            style={{
                                width: 30,
                                height: 30,
                                border: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                backgroundColor: cell === '' ? '#fff' : (cell === 'X' ? '#f0f0f0' : '#e0e0e0'),
                                color: cell === 'X' ? '#000' : '#333',
                            }}
                        >
                            {cell}
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default HomePage;


