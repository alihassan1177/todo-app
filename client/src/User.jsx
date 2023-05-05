import { createContext, useState, useContext } from "react";

const Context = createContext()

export function useUser() {
    return useContext(Context)
}

export default function UserContext({ children }) {

    const USER_KEY = "todoUser"
    const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_KEY)) || false)

    function saveUserInfo(user){
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  
    return <Context.Provider value={{ user, saveUserInfo }}>
        {children}
    </Context.Provider>
}
