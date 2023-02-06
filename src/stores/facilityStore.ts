import {makeAutoObservable} from "mobx";
import {Facility} from "../entities/facility";
import {RootStore} from "./rootStore";

export class FacilityStore {
    rootStore: RootStore;

    facilities: Facility[] = [];
    facility?: Facility;
    totalElements = 0;
    pageSize = 10;
    pageNumber = 0;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setFacilities(facilities: Facility[]) {
        this.facilities = facilities;
    }

    setFacility(facility: Facility) {
        this.facility = facility;
    }

    setTotalElements(totalElements: number) {
        this.totalElements = totalElements;
    }

    setPageSize(pageSize: number) {
        this.pageSize = pageSize;
    }

    setPageNumber(pageNumber: number) {
        this.pageNumber = pageNumber;
    }

    // TODO: unocomment latter
    // createFacility(facility: Facility) {

    // }

    deleteById(id: string) {
        this.facilities = this.facilities.filter(facility => facility.id !== id)
    }
}
