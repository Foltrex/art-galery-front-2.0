import {makeAutoObservable} from "mobx";
import {Address} from "../entities/address";
import {RootStore} from "./rootStore";

export class AddressStore {
    rootStore: RootStore;

    addresses: Address[] = [];
    address?: Address;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setAddresses(addresses: Address[]) {
        this.addresses = addresses;
    }

    getAddresses() {
        return this.addresses;
    }

    setAddress(address: Address) {
        this.address = address;
    }
}
