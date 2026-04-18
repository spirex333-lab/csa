import { fromAsciiToBase64, fromBase64ToAscii, getCookie, setCookie } from "../core";

export * from "./login"

export const getUser = () => {
    try {
        const u = getCookie("u");
        if (u && u.length) {
            return JSON.parse(fromBase64ToAscii(u));
        }
    } catch (e) {
        console.error(e)
    }
}

export const setUser = (user: any) => {
    if (!user || Object.keys(user || {}).length <= 0) return;
    try {
        setCookie("u", fromAsciiToBase64(JSON.stringify(user)))
    } catch (e) {
        console.error(e)
    }
}

export const getAuthToken = () => {
    try {
        return getCookie("token");
    } catch (e) {
        console.error(e)
    }
    return null;
}

export const setAuthToken = (token: any) => {
    if (!token || token.length <= 0) return;
    try {
        setCookie("token", token)
    } catch (e) {
        console.error(e)
    }
}

export const clearAuth = () => {
    setCookie("token", "", 0);
    setCookie("u", "", 0);
}

export const logout = (redirect?: string | (() => void)) => {
    clearAuth()
    setTimeout(() => {
        if (redirect && typeof window !== "undefined") {
            if (typeof redirect === "function") {
                redirect()
            } else {
                window.location.href = redirect
            }
        }
    }, 0)
}
