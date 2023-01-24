import jwt_decode from "jwt-decode";
import {TDecodedToken} from "../entities/types/TDecodedToken";

export class TokenService {

    static decode(token: string): TDecodedToken {
        return jwt_decode(token);
    }

}