import {ReactNode, useState} from 'react';
import {Marker, Popup, useMap} from 'react-leaflet';
import {Icon} from 'leaflet';

import {MapIcon, Comments} from "../";
import {MapPopupOnOpen} from "../../helpers/";
import {LocationData, FileInfo} from "../../../types";
import {UseJSAPI, UserHasPermission} from "../../../utils/";

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
    OnFileSelect?: (file: FileInfo) => void;
    OnLoad?: () => void;
};

export const MapMarker= ({
        location,
        icon = MapIcon("blue"),
        children,
        OnAdd,
        OnAddFile,
        OnRemove,
        OnCenter = true,
        OnCustom,
        OnFileSelect,
        OnLoad
    }: LocationMarkerProps) => {

    const [files, setFiles] = useState<FileInfo[]>([]);
    const [fileSelected, setFileSelected] = useState<FileInfo | null>(null);
    const [checked, setChecked] = useState(false);
    const [filesFetched, setFilesFetched] = useState(0);


    const jsapi = UseJSAPI();
    const map = useMap();

    var actions: {[key: string]: () => void} = {}; 

    if (OnAdd) {
        if (UserHasPermission("saveLocation")) {
            actions["Add"] = () => { OnAdd(location) }
        }
    }

    if (OnAddFile) {
        if (UserHasPermission("saveFile")) {
            actions["Add File"] = () => { OnAddFile(location) }
        }
    }

    // Center defaults to on unless explicitly disabled with 'false', can also be overriden with OnCenter()
    if (OnCenter) {
        actions["center"] = ((OnCenter === true) ?
                                () => {
                                    /*let popup: any;
                                    map.eachLayer((layer) => {
                                        if (layer.isPopupOpen()) popup = layer.getPopup();
                                    });*/
                                    
                                    map.closePopup();
                                    map.flyTo([location.mapLat, location.mapLon], map.getZoom()); 
                                    //map.on("moveend", () => { if (popup && map) map.openPopup(popup); }); // infinite recursion
                                }
                            :   () => { OnCenter(location) });
    }

    if (OnRemove) {
        if (UserHasPermission("removeLocation")) {
            actions["remove"] = () => { OnRemove(location) }
        }
    }

    for (let key in OnCustom) {
        actions[key] = OnCustom[key]
    }

    const handleLoad = () => {
        // On load, needs to fetch all filenames and then all file details
        if (!checked && location.id && location.id !== -1) {
            jsapi.GetLocationFiles(location.id).then(function(json: any) {
                json.filenames.forEach((filename: string) => {
                    console.log("Checking: " + filename);
                    
                    jsapi.GetFileInfo(filename).then(
                        (fileInfo: any) => {
                            console.log("Found file");
                            console.log(fileInfo);
                            let newFiles = files;
                            console.log(fileInfo);

                            newFiles.push({
                                id: fileInfo.file_id,
                                filename: filename,
                                title: fileInfo.title,
                                description: fileInfo.description,
                            });
                            
                            setFiles([...newFiles]);
                            //if (OnLoad) OnLoad(); // TODO, should call after all loaded
                        },
                        error => {console.log(error);},
                    );

                    setChecked(true);
                });
            });
        }
    }

    const handleFileSelect = (file: FileInfo) => {
        setFileSelected(file);
    }

    return (
        <Marker position={[location.mapLat, location.mapLon]} icon={icon} >
            <Popup maxWidth={700} >
                <MapPopupOnOpen OnOpen={handleLoad} />
                {(location.address) ? `${location.address.city}, ${location.address.country}` : location.label }

                <MapMarkerActions actions={actions}/> 

                <div>
                {(fileSelected === null && files) ? files.map((file,key) => {
                    let className = "MapMarkerFile";
                    if (key === files.length-1) className = "MapMarkerLastFile";
                    return (<div className={className} onClick={() => {handleFileSelect(file); } }>
                        <div>{file.title}</div>
                        <img alt={file.title} width="100%" src={`/img/tmp/${file.filename}`}  />
                    </div>);
                }) : null}
                {(fileSelected !== null) ? 
                        <div className="MapMarkerSingleFile">
                            <div className="MapMarkerSingleFileTitle">
                                {fileSelected.title}
                                <div className="MapMarkerSingleFileButton">
                                    <button onClick={() => {setFileSelected(null);}}>X</button>
                                </div>
                            </div>
                            <hr/>
                            <div className="MapMarkerSingleImageWrapper">
                                <a href={`/img/tmp/${fileSelected.filename}`} target="_blank" rel="noreferrer">
                                    <img alt={fileSelected.title} width="100%" src={`/img/tmp/${fileSelected.filename}`}  />
                                </a>
                            
                                <div>{fileSelected.description}</div>
                            </div>
                            <Comments fileId={fileSelected.id} />
                        </div>
                    : null
                }
                </div>
                {(fileSelected === null && location.id !== -1) ?
                        <Comments locationId={location.id} />
                    : null
                }

                {children}
            </Popup>
        </Marker>
    );
};
