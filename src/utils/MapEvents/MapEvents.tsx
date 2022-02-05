import {useMapEvents, useMap} from 'react-leaflet';
import {LocationData, MapProps} from "../../types";

type MapEventsProps = {
    location?: LocationData;
    OnMove?: (map: MapProps) => void;
    OnZoom?: (map: MapProps) => void;
};

export const MapEvents = ({
        location,
        OnMove,
        OnZoom
    }: MapEventsProps) => {

    const map = useMap();
    const mapProps = new MapProps(map);

    let mapEvents: {[key: string]: (e: any) => void} = {};

    // Allows user to pan to a location on click, won't pan if detect double click
    const doClickPan = true; // TODO: maybe make this an option?
    if (doClickPan) {
        let doFly = true;

        // OnClick, wait 250ms to see if a double click occurs, if not, recenter map on click location
        mapEvents["click"] = (e) => {
            // Only pan if the actual map was clicked
            var div = e.originalEvent.target;
            if (div != null) {
                //doFly = (div.className.indexOf("leaflet-container") == 0) // No longer working after `npm update`?
                doFly = div.hasOwnProperty("_leaflet_events");

                setTimeout(function() {
                    if (doFly) {
                        map.flyTo(e.latlng, map.getZoom())
                    }
                }, 250);
            }
        }

        // Disable panning if detect doubleclick
        mapEvents["dblclick"] = (e) => {
            doFly = false;
        }
    }

    // Pass back new center location to OnMove()
    if (OnMove) {
        mapEvents["move"] = (e) => {
            OnMove(mapProps);
        };
    }

    if (OnZoom) {
        mapEvents["zoom"] = (e) => {
            OnZoom(mapProps);
        };
    }


    useMapEvents(mapEvents);

    // Center on a new location
    /*if (location) {
        map.flyTo([location.lat, location.lon], map.getZoom())
    }*/

    return null;
};
