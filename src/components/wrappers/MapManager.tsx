import {useState, ReactNode} from 'react';
import { MapContainer, TileLayer, ZoomControl} from 'react-leaflet';

import {LocationSearch, MapMarkers, MapMarker, MapIcon, MapMenuBar, DialogBox, DialogFullScreen, FileUpload} from "../ui/";
import {MapEvents, UseJSAPI} from "./../../utils/";

import {LocationData, MapProps, FileInfo} from "../../types";

type MapManagerProps = {
    children?: ReactNode;
}

export const MapManager = ({
    children
}: MapManagerProps) => {

    const [searchLocations, setSearchLocations] = useState<LocationData[]>([]);
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [checkedLocations, setCheckedLocations] = useState(false);

    const [fileLocationId, setFileLocationId] = useState(-1);
    const [refreshNum, setRefreshNum] = useState(0);

    const jsapi = UseJSAPI();

    // Init
    if (!checkedLocations) {
        setCheckedLocations(true);
        jsapi.GetAllLocations().then((json: any) => {
            //let json = JSON.parse(jsonStr);
            let newLocations = locations;

            json.locations.forEach((location: any) => {
                newLocations.push({
                    id: location.id,
                    label: location.label,
                    lat: Number(location.lat),
                    lon: Number(location.lon),
                    mapLat: Number(location.lat),
                    mapLon: Number(location.lon),
                    type: location.type,
                });
            });
            setLocations([...newLocations]);
        });
    }

    // Center on the first location (if any), otherwise center around Europe
    //const [center, setCenter] = useState<[number,number]>((locations.length > 0) ? [locations[0].lat,locations[0].lon] : [20,20]); 

    const handleNewLocationSelection = (newLocation: LocationData) => {
        jsapi.SaveLocation(newLocation).then(function(json: any) {
            newLocation.id = json.id;

            const newLocations = locations.concat(newLocation);

            setLocations(newLocations);
        });

        setSearchLocations([]);
    };

    const handleSearchResult = (newLocations: LocationData[]) => {
        //setCenterLocation(newLocations[0]);
        setSearchLocations(newLocations);
    };

    const handleRemoveLocation = (location: LocationData) => {
        const newLocations = locations.filter(function(val, id, arr) {
            return (location !== val);
        });
        setLocations(newLocations);
    };

    const handleAddFile = (location: LocationData) => {
        if (location.id && location.id != -1) setFileLocationId(location.id);
    }
    return (
        <>
        <MapMenuBar OnSearchResult={handleSearchResult}/>
        {(fileLocationId != -1) ? 
            <DialogBox title="File Upload" OnClose={() => { setFileLocationId(-1); }}>
                <FileUpload url={`/upload/photo/${fileLocationId}/`} OnFinish={(success: boolean) => { 
                            if (success) setFileLocationId(-1); 
                            else alert("Could not upload file...");
                        }} />
                <br/>
                <input type="button" value="get files" 
                       onClick={() => { 
                                jsapi.GetLocationFiles(fileLocationId).then(function(json: any) {
                                    console.log("resp");
                                    console.log(json.filenames);
                                });
                            } 
                        } 
                />
            </DialogBox>
            : null 
        }
        <MapContainer center={[20,20]} zoom={3} scrollWheelZoom={true} zoomControl={false}>
                <ZoomControl position="topright" />

                {searchLocations.map((location, key) => (
                    <MapMarker location={location} icon={MapIcon("green")} OnAdd={handleNewLocationSelection} key={key} />
                ))}

                <MapMarkers locations={locations} OnRemove={handleRemoveLocation} OnAddFile={handleAddFile}>
                    <br/>
                </MapMarkers>


                {children}

                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
        </>
    );
}
