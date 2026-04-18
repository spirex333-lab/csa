import { createContext, useContext } from "react"
import { SocketIO } from "../socket"

export type UseSocketOptions = {
    user: any
}

export type SocketContextType = {
    socket?: SocketIO
}

let socket: SocketIO;
export const SocketContext = createContext<SocketContextType>({
    socket: undefined
})

export const useSocket = () => useContext(SocketContext)