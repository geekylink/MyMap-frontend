import {useState, useEffect} from 'react';

import {lookupLocation} from "./LocationSearch.functions";
import {LocationData} from "../../../types/";
//import {MapManager} from "../../../utils/MapManager/";

import "./LocationSearch.css"

type LocationSearchProps = {
    OnSearchResult: (location: LocationData[]) => void;
};


export const LocationSearch= ({
        OnSearchResult
    }: LocationSearchProps) => {

    const [locText, setLocText] = useState("");
    const [statusText, setStatusText] = useState("");
    //const [options, setOptions] = useState<LocationData[]>([])

    const handleLookupLocation = () => {
        setStatusText("Querying...");

        lookupLocation(locText).then(data => {

            OnSearchResult(data);

            if (data.length === 0) {
                setStatusText("Nada. Try Again.");
            } else {
                setStatusText("");
            }
        });
    };

    // Set title while looking up
    useEffect(() => {
        document.title = `Super Map App 
                            ${(statusText !== "") ? ` - ${statusText}` : ""}`;
    }, [statusText]);

    return (
        <div id="LocationSearch" className="LocationSearch">
            <input type="text" value={locText} 
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        handleLookupLocation();
                    }
                }}
                onChange={(e) => setLocText(e.target.value)}
                placeholder="Enter location..." />
            <div>{statusText}</div>
        </div>
    );
};

