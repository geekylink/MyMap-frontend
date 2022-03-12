import {LocationData} from "../../../types/";

async function fetchData (location: string) {
    // Returns all possiblities for location
    // Example: "Las Vegas" will return more options than "Las Vegas, NV"

    const url = `https://nominatim.openstreetmap.org/search?q=
                    ${location}&format=json&polygon_geojson=1&addressdetails=1`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

// fetchData JSON fields:
type LocationType = {
    display_name: string;
    lat: number;
    lon: number;
    type: string;
    address: {
        village?: string;
        hamlet?: string;
        city?: string;
        town?: string;
        region?: string;
        state?: string;
        country: string;
    };
};

export async function lookupLocation (location: string): Promise<LocationData[]> {
    const data = await fetchData(location);
    let options: LocationData[] = [];

    data.forEach((loc: LocationType) => {

        switch (loc.type) {
            case "city":
            case "town":
            case "hamlet":
            case "village":
            case "administrative":

                let city = "";
                city = (loc.address.city) ? loc.address.city : city;
                city = (loc.address.town) ? loc.address.town : city;
                city = (loc.address.hamlet) ? loc.address.hamlet : city;
                city = (loc.address.village) ? loc.address.village : city;
                city = (loc.address.region) ? loc.address.region : city;

                let state = ""
                state = (loc.address.region) ? loc.address.region : state;
                state = (loc.address.state) ? loc.address.state : state; 

                let country = (loc.address.country) ? loc.address.country : "";

                if (country === "") {
                    console.log("Bad Country in loc: ", loc)
                }
                else if (city === "") {
                    console.log("Bad City in loc: ", loc)
                }
                else {
                    //console.log(loc);
                    options.push({
                        id: -1,
                        label: loc.display_name,
                        lat: Number(loc.lat),
                        lon: Number(loc.lon),
                        mapLat: Number(loc.lat),
                        mapLon: Number(loc.lon),
                        type: loc.type,
                        address: {
                            city: city,
                            state: state,
                            country: loc.address.country
                        }
                    });
                }
        }
    });

    console.log(options);

    return options;
};

