import {Metadata} from "./metadata";
import {AccountEnum} from "./enums/AccountEnum";

export interface Account {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: AccountEnum;
    metadata: Metadata[];
}
