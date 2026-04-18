import 'server-only';
import { cookies } from "next/headers"

export const removeToken = () => {
    cookies().delete("token")
}