import {RootStore} from "./rootStore";
import {makeAutoObservable} from "mobx";
import {Account} from "../entities/account";

export class AuthStore {
    rootStore: RootStore;

    account?: Account;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setAccount(account:Account) {
        this.account = account;
    }
}