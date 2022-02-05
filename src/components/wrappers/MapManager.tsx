import {useState, ReactNode} from 'react';
import { MapContainer, TileLayer, ZoomControl} from 'react-leaflet';

import {LocationSearch, MapMarkers, MapMarker, MapIcon, MapMenuBar, DialogBox, FileUpload} from "../ui/";
import {MapEvents, UseJSAPI} from "./../../utils/";

import {LocationData, MapProps} from "../../types";

type MapManagerProps = {
    children?: ReactNode;
}

export const MapManager = ({
    children
}: MapManagerProps) => {
    // Read in locations from localStorage, parse if possible, then add to default locations
    const locationData = localStorage.getItem("locations");
    const locationJSON = JSON.parse((locationData) ? locationData : "[]");

//    const [centerLocation, setCenterLocation] = useState<LocationData>();
    const [searchLocations, setSearchLocations] = useState<LocationData[]>([]);
    const [locations, setLocations] = useState<LocationData[]>(locationJSON ? locationJSON : []);

    const [topLeft, setTopLeft] = useState<[number, number]>();
    const [bottomRight, setBottomRight] = useState<[number, number]>();

    const [exportData, setExportData] = useState("");
    const [showImport, setShowImport] = useState(false);
    const [fileLocationId, setFileLocationId] = useState(-1);

    const jsapi = UseJSAPI();

    // Center on the first location (if any), otherwise center around Europe
    //const [center, setCenter] = useState<[number,number]>((locations.length > 0) ? [locations[0].lat,locations[0].lon] : [20,20]); 

    const handleNewLocationSelection = (newLocation: LocationData) => {
        jsapi.SaveLocation(newLocation).then(function(json: any) {
            newLocation.id = json.id;

            const newLocations = locations.concat(newLocation);

            localStorage.setItem("locations", JSON.stringify(newLocations));
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
        localStorage.setItem("locations", JSON.stringify(newLocations));
    };

    const handleMapMove = (map: MapProps) => {
        //console.log("OnMove:", map);
        //setCenter(map.center.toAr());
    };

    const handleMapZoom = (map: MapProps) => {
        //console.log("OnZoom:", map);
        setTopLeft(map.topLeft.toAr());
        setBottomRight(map.bottomRight.toAr());
    };

    const handleExportClick = () => {
        setExportData(JSON.stringify(locations));
    }

    const handleImportClick = () => {
        setShowImport(true);
    }

    const handleAddFile = (location: LocationData) => {
        if (location.id && location.id != -1) setFileLocationId(location.id);
    }

    return (
        <>
        <MapMenuBar OnSearchResult={handleSearchResult} OnExport={handleExportClick} OnImport={handleImportClick}/>
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

                <MapEvents OnMove={handleMapMove} OnZoom={handleMapZoom} />

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

        {(exportData) ? <DialogBox title="Map Location Data" message={exportData} showCopy={true} OnClose={() => { setExportData("") } }/> : null}
        {(showImport) ? <DialogBox title="Import Map Location Data:" message={""} 
                                    OnClose={() => { setShowImport(false); }} 
                                    OnSubmit={(importData) => 
                                                { 
                                                    if (importData == "") importData = "[]";
                                                    setLocations(JSON.parse(importData));
                                                }} 
                                        /> : null}
        </>
    );
}
