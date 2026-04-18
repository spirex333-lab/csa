import { proxy } from "valtio";

export type AuthContext = {
    jwt?: string | null
    user?: any
}

export const AuthContext = proxy<AuthContext>({
})