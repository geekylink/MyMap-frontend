export interface LocationData {
    id?: number;
    label: string;
    lat: number;
    lon: number;
    type: string;
    mapLat: number;
    mapLon: number;
    address: {
        city?: string;
        county?: string;
        state?: string;
        country?: string;
        code?: number;
    };
}

