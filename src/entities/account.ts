import { AccountEnum } from "./enums/AccountEnum";
import { Metadata } from "./metadata";

export interface Account {
    id: string;
    email: string;
    accountType: AccountEnum;
    metadata: Metadata[];
}