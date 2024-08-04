import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { UserType } from '@/@types/auth,type';


// Setup Socket
export const useSocket = (namespace?: string | null) => {
    const authToken = localStorage.getItem('access_token');

    if (!authToken) {
        throw new Error('No access token found');
    }

    return io(`http://localhost:8000/${namespace}`, {
        transports: ['websocket'],
        auth: {
            token: authToken
        },
        withCredentials: true // Include credentials (cookies) if needed
    });
};



export const useSocketRoom = (namespace: string, roomId: string, user: UserType) => {
    const [socket, setSocket] = useState<any>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const authToken = localStorage.getItem('access_token');

    if (!authToken) {
        throw new Error('No access token found');
    }
    useEffect(() => {
        const socket = io(`http://localhost:8000/${namespace}`, {
            transports: ['websocket'],
            auth: {
                token: authToken
            },
            withCredentials: true // Include credentials (cookies) if needed
        })// Kết nối với WebSocket Server
        setSocket(socket);

        socket.emit('joinRoom', { roomId, user });

        socket.on(`userJoined`, (data: UserType[]) => {
            setUsers(data);
        });

        socket.on('userLeft', (data: UserType[]) => {
            setUsers(data)
        });

        socket.on('updateUsers', (data: UserType[]) => {
            setUsers(data);
        });

        return () => {
            socket.emit('leaveRoom', { roomId });
            socket.disconnect();
        };
    }, [roomId, user]);

    return { users };
};