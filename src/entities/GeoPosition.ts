export interface GeoPosition {
    place_id: number,
    display_name: string,
    lat: number,
    lng: number,
    alt?:number,
    address: {
        city?: string,
        route?: string,
        village?: string,
        place?: string,
        natural?: string,
        state?: string,
        country?: string,
        postcode?: string,
        region?: string,
        city_district?: string,
        street?:string,
        house_number?:string
    }
}
export interface GeoBounds {
    north: number,
    south: number,
    west: number,
    east: number
}

export interface GoogleAddressComponent {
    long_name:string,
    short_name: string,
    types: string[]
}
export interface GoogleSearchPlace {
    place_id: string,
    terms: {value:string}[]
}
export interface GooglePlace {
    address_components: GoogleAddressComponent[],
    geometry: {
        location: {
            lat: number,
            lng: number
        }
        viewport: {
            south: number,
            west: number,
            north: number,
            east: number,
        }
    },
    name: string,
    place_id: string
    reference: string//same as place id
    types: string[],
    url: string,
}
export class GoogleSearchAddress {
    text:string;
    constructor(g:GoogleSearchPlace) {
        let data:string[] = [];
        for(let i = g.terms.length - 1; i >= 0; i--) {
            data.push(g.terms[i].value);
        }
        this.text = data.join(", ");
    }
    toString() {
        return this.text;
    }
}
export class GoogleAddress {
    country?:string
    state?:string
    county?:string
    city?:string
    zip?:string
    route?:string
    house_number?:string
    constructor(g:GooglePlace) {
        g.address_components.forEach(item => {
            const map:Record<string, boolean> = item.types.reduce((m, i) => {
                m[i] = true;
                return m;
            }, {} as Record<string, boolean>);
            if(map["country"]) {
                this.country = item.long_name;
            } else if(map["administrative_area_level_1"]) {
                this.state = item.long_name;
            } else if(map["administrative_area_level_2"]) {
                this.county = item.long_name;
            } else if(map["locality"]) {
                this.city = item.long_name;
            } else if(map["postal_code"]) {
                this.zip = item.long_name;
            } else if(map["route"]) {
                this.route = item.long_name;
            } else if(map["street_number"]) {
                this.house_number = item.long_name;
            } else {
                console.log('failed to parse address')
                console.log(item);
            }
        })
    }

    toString() {
        return [this.country, /*this.state, this.county, */this.city,
            this.route ? this.route + (this.house_number ? " " + this.house_number : "") : undefined,

            this.zip].filter(b => b).join(", ");
    }
}