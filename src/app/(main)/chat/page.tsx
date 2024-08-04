"use client"

import { useSocketRoom } from '@/socket';
import { useAppContext } from '@/ContextProvider';

const ChatRoom = ({ roomId }: { roomId: string }) => {
    const { user } = useAppContext()
    if (user === null) return
    const { users } = useSocketRoom("", "linhto2001", user);
    console.log(users)
    return (
        <div>
            <div>
                <h2 className='text-black'>Room: {roomId}</h2>
                <div>
                    <h3 className='text-black'>Users:</h3>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index}>{user.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
