import {Metadata} from "./metadata";
import {AccountEnum} from "./enums/AccountEnum";

export interface Account {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    blockedSince: Date;
    accountType: AccountEnum;
    metadata: Metadata[];
}
