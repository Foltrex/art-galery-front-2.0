import {AddressStore} from "./addressStore";
import {CityStore} from "./cityStore";
import {FacilityStore} from "./facilityStore";
import {OrganizationStore} from "./organizationStore";
import {RepresentativeStore} from "./representativeStore";
import {AlertStore} from "./alertStore";


export class RootStore {
    alertStore: AlertStore;
    facilityStore: FacilityStore;
    representativeStore: RepresentativeStore;
    organizationStore: OrganizationStore;
    cityStore: CityStore;
    addressStore: AddressStore;

    constructor() {
        this.alertStore = new AlertStore(this)
        this.facilityStore = new FacilityStore(this);
        this.representativeStore = new RepresentativeStore(this);
        this.organizationStore = new OrganizationStore(this);
        this.cityStore = new CityStore(this);
        this.addressStore = new AddressStore(this);
    }
}

const rootStore = new RootStore();
export default rootStore;