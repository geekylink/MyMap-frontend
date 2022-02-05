import {ReactNode, useState} from 'react';
import {Marker, Popup, useMap} from 'react-leaflet';
import {Icon} from 'leaflet';

import {MapIcon} from "../";
import {MapPopupOnOpen} from "../../helpers/";
import {LocationData} from "../../../types";
import {UseJSAPI} from "../../../utils/";

import "./MapMarker.css"

type MapMarkerActionsProps = {
    actions: { [key: string]: () => void}; 
};

const MapMarkerActions = ({
        actions = {},
    }: MapMarkerActionsProps) => {


    if (Object.keys(actions).length === 0) {
        return null;
    }


    return (
        <div style={{"textAlign":"right"}}>
            Actions: 
            {Object.keys(actions).map((functionName,key) => (
                <button onClick={actions[functionName]} key={key}>{functionName}</button>
            ))}
            <br/>
        </div>
    );
}

type LocationMarkerProps = {
    location: LocationData;
    icon?: Icon;
    children?: ReactNode;
    OnAdd?: (location: LocationData) => void;
    OnAddFile?: (location: LocationData) => void;
    OnRemove?: (location: LocationData) => void;
    OnCenter?: ((location: LocationData) => void) | boolean;
    OnCustom?: { [key: string]: () => void}; 
};

export const MapMarker= ({
        location,
        icon = MapIcon("blue"),
        children,
        OnAdd,
        OnAddFile,
        OnRemove,
        OnCenter = true,
        OnCustom 
    }: LocationMarkerProps) => {

    const [files, setFiles] = useState<string[]>([]);

    const jsapi = UseJSAPI();
    const map = useMap();


    var actions: {[key: string]: () => void} = {}; 

    if (OnAdd) {
        actions["Add"] = () => { OnAdd(location) }
    }

    if (OnAddFile) {
        actions["Add File"] = () => { OnAddFile(location) }
    }

    // Center defaults to on unless explicitly disabled with 'false', can also be overriden with OnCenter()
    if (OnCenter) {
        actions["center"] = ((OnCenter === true) ?
                                () => {
                                    let popup: any;
                                    map.eachLayer((layer) => {
                                        if (layer.isPopupOpen()) popup = layer.getPopup();
                                    });

                                    map.closePopup();
                                    map.flyTo([location.mapLat, location.mapLon], map.getZoom()); 
                                    //map.on("moveend", () => { if (popup && map) map.openPopup(popup); }); // infinite recursion
                                }
                            :   () => { OnCenter(location) });
    }

    if (OnRemove) {
        actions["remove"] = () => { OnRemove(location) }
    }

    for (let key in OnCustom) {
        actions[key] = OnCustom[key]
    }

    const handleLoad = () => {
        if (files.length == 0 && location.id && location.id != -1) {
            jsapi.GetLocationFiles(location.id).then(function(json: any) {
                console.log(location);
                console.log(json.filenames);
                setFiles(json.filenames);
            });
        }
    }
    
    return (
        <Marker position={[location.mapLat, location.mapLon]} icon={icon} >
            <Popup maxWidth={700} >
                <MapPopupOnOpen OnOpen={handleLoad} />
                {(location.address) ? `${location.address.city}, ${location.address.country}` : null}

                <MapMarkerActions actions={actions}/> 

                {(files) ? files.map((filename,key) => {
                    let style = { };
                    // Last image can't have this style or it will mess up the popup
                    if (key < files.length-1) {
                        style = {"float":"left"}
                    }
                    return (
                        <div style={style}>
                            <div>lol {key} {files.length}</div>
                            <img width="25%" src={`img/tmp/${filename}`} />
                        </div>
                    );
                }) : null}

                {children}
            </Popup>
        </Marker>
    );
};
