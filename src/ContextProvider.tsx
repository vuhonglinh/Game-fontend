"use client"
import { UserType } from '@/@types/auth,type';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppContextType {
    user: UserType | null
    setUser: (user: UserType | null) => void
}

// Tạo một đối tượng context với giá trị mặc định.
export const AppContext = createContext<AppContextType>({
    user: null,
    setUser: () => { },
});

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<UserType | null>(() => {
        const _user = localStorage.getItem('user')
        return _user ? JSON.parse(_user) : null
    })

    const setUser = (user: UserType | null) => {
        setUserState(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );
}



//Một hook tùy chỉnh sử dụng useContext để truy cập vào AppContext (không liên quan )
export const useAppContext = () => {
    return useContext(AppContext);
};