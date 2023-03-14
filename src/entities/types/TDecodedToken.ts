import {AccountEnum} from "../enums/AccountEnum";
import {RoleEnum} from "../enums/RoleEnum";

export interface TDecodedToken {
    sub: string,
    id: string,
    type: AccountEnum,
    roles: RoleEnum[],
    iat: number,
    exp: number,
}