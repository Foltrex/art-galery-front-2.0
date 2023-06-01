import {Account} from "../../entities/account";
import {Proposal} from "../../entities/proposal";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import {Art} from "../../entities/art";
import {Organization} from "../../entities/organization";
import {Facility} from "../../entities/facility";

export function createNewProp(account: Account) {
    const prop:Proposal = {
        id: '',
        art: {
            name: '',
            description: '',
            artistAccountId: '',
            artStyles: [],
            price: 0,
            artSize: {
                id: '', label: '', verified: true
            },
            dateCreation: new Date(),
            files: [],
            artInfos: []
        },
        price: 0,
        commission: 0,
        currency: {id: '', label: '', value: ''},
        artist: account.accountType === AccountEnum.ARTIST ? account : {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            blockedSince: new Date(),
            accountType: AccountEnum.ARTIST,
            metadata: []
        },
        organization: {
            id: '',
            name: '',
            facilities: [],
            address: null,
            status: OrganizationStatusEnum.ACTIVE
        },
        facilities: [createNewFacility(null, null)],
        artistConfirmation: account.accountType === AccountEnum.ARTIST,
        organizationConfirmation: account.accountType === AccountEnum.REPRESENTATIVE
    }

    const builder = {
        organization: (org:Organization) => {
            prop.organization = org;
            prop.facilities = prop.facilities.map(f => ({...f, organizationId: org.id}))
            return builder;
        },
        facilities: (facilities:Facility[]) => {
            prop.facilities = facilities;
            return builder;
        },
        art: (art:Art) => {
            prop.art = art;
            prop.price = art.price;
            return builder;
        },
        build: () => {
            return prop;
        }
    }

    return builder;
}

export function createNewFacility(facilityId:string|null, organizationId:string|null):Facility {
    return {
        id: facilityId || '',
        organizationId: organizationId || '',
        name: '',
        isActive: true,
        address: {id: '', name: '', city: {id: '', name: '', country: '', latitude: 0, longitude: 0}},
        images: []
    }
}