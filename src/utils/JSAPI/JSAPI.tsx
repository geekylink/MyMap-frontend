import {LocationData} from "../../types/";

const JSONAPICall = (url: string, body: string) => {
    // POSTs JSON and returns a promise that fetches the JSON response

    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
    }

    return new Promise((resolve, reject) => {
        fetch(url, reqOptions).then(response => {

            // Bad response, don't try to parse
            if (!response.ok) {
                reject(response);
                return;
            }

            response.json().then(json => {
                if (json.status == "OK") resolve(json);
                reject(json);
            })
        });
    });
}

const GETAPICall = (url: string) => {
    const reqOptions = {
        method: 'GET',
    }

    return new Promise((resolve, reject) => {
        fetch(url, reqOptions).then(response => {
            // Bad response
            if (!response.ok) {
                reject(response);
                return;
            }

            response.text().then(resp => {
                resolve(resp);
            });
        });
    });
}

const Login = (username: string, password: string) => {
    // JSON Login

    return JSONAPICall("/user/login/", 
                        JSON.stringify({ 
                            username: username,
                            password: password,
                        }));
}

const Logout = () => {
    return GETAPICall("/user/logout/");
}

const CheckLogin = () => {
    return GETAPICall("/user/");
}

const GetLocationFiles = (locationId: number) => {
    // Fetch filenames (photos) for a location

    return JSONAPICall("/api/getLocationFiles/", 
                        JSON.stringify({ 
                            id: locationId,
                        }));
}

const SaveLocation = (location: LocationData) => {
    return JSONAPICall("/api/saveLocation/", 
                        JSON.stringify({ 
                            label: location.label,
                            lat: location.lat,
                            lon: location.lon,
                            data: JSON.stringify(location),
                        }));
}

export const UseJSAPI = () => {
    // Returns API Calls available
    return {
        "GetLocationFiles": GetLocationFiles,
        "SaveLocation":     SaveLocation,
        "Login":            Login,
        "Logout":           Logout,
        "CheckLogin":       CheckLogin,
    }
}

