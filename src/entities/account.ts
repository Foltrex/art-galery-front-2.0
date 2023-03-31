import {Metadata} from "./metadata";
import {AccountEnum} from "./enums/AccountEnum";

export interface Account {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    accountType: AccountEnum;
    metadata: Metadata[];
}
