import {Cookies} from "react-cookie"
import {TokenService} from "./TokenService";

const cookies = new Cookies()

export class AuthService {

    static isAuthenticated(): boolean {
        return cookies.get("token") !== undefined;
    }

    static getToken(): string {
        if (!this.isAuthenticated()) {
            throw new Error("User is not authenticated")
        }

        return cookies.get("token")
    }

    static setToken(token: string) {
        const decoded = TokenService.decode(token)
        cookies.set("token", token, {
            path: "/",
            sameSite: "strict",
            maxAge: decoded.exp - decoded.iat,
        })
    }

    static setRememberMe(isRemember: boolean) {
        localStorage.setItem("remember_me", String(isRemember))
    }

    static getRememberMe(): boolean {
        if (!this.isAuthenticated()) {
            throw new Error("User is not authenticated")
        }

        return localStorage.getItem("remember_me") === "true";
    }

    static logout() {
        cookies.remove("token", {path: "/"})
        localStorage.removeItem("remember_me")
    }

}
