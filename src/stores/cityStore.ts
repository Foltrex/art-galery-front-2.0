import { makeAutoObservable } from "mobx";
import { City } from "../entities/city";
import { RootStore } from "./rootStore";

export class CityStore {
    rootStore: RootStore;

    cities: City[] = [];
    city?: City;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setCities(cities: City[]) {
        this.cities = cities;
    }

    setCity(city: City) {
        this.city = city;
    }
}