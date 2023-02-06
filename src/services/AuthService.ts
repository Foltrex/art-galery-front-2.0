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

    static logout() {
        cookies.remove("token", {path: "/"})
    }

}
