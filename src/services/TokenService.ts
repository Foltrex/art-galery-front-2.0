import jwt_decode from "jwt-decode";
import {TDecodedToken} from "../entities/types/TDecodedToken";
import {AuthService} from "./AuthService";
import {AccountEnum} from "../entities/enums/AccountEnum";

export class TokenService {

    static decode(token: string): TDecodedToken {
        return jwt_decode(token);
    }

    static getCurrentDecodedToken(): TDecodedToken {
        const token = AuthService.getToken();
        return TokenService.decode(token);
    }

    static getCurrentAccountId(): string {
        return this.getCurrentDecodedToken().id
    }

    static getCurrentAccountType(): AccountEnum {
        return this.getCurrentDecodedToken().type
    }

}