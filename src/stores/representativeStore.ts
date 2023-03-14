import {makeAutoObservable} from "mobx";
import {Representative} from "../entities/representative";
import {RootStore} from "./rootStore";

export class RepresentativeStore {
    rootStore: RootStore;

    representatives: Representative[] = [];
    representative?: Representative;
    totalElements = 0;
    pageSize = 10;
    pageNumber = 0;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setRepresentatives(representatives: Representative[]) {
        this.representatives = representatives;
    }

    setRepresentative(representative: Representative) {
        this.representative = representative;
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

    deleteById(id: string) {
        this.representatives = this.representatives.filter(representative => representative.id !== id);
    }

}
