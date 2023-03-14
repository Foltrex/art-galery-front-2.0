import {makeAutoObservable} from "mobx";
import {Organization} from "../entities/organization";
import {RootStore} from "./rootStore";

export class OrganizationStore {
    rootStore: RootStore;

    organizations: Organization[] = [];
    organization?: Organization;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setOrganizations(organizations: Organization[]) {
        this.organizations = organizations;
    }

    setOrganization(organization: Organization) {
        this.organization = organization;
    }
}
