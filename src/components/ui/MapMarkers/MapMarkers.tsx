import React from 'react';
import { Icon } from 'leaflet';

import {LocationData, FileInfo} from "../../../types";
import {MapMarker} from "../";

type MapMarkersProps = {
    locations: LocationData[];
    icon?: Icon;
    children?: React.ReactNode;
    OnAdd?: (location: LocationData) => void;
    OnAddFile?: (location: LocationData) => void;
    OnRemove?: (location: LocationData) => void;
    OnCenter?: ((location: LocationData) => void) | boolean;
    OnFileSelect?: (file: FileInfo) => void;
    OnLoad?: () => void;
};

export const MapMarkers = ({
        locations,
        icon,
        children,
        OnAdd = () => {},
        OnAddFile,
        OnRemove = () => {},
        OnCenter = true,
        OnFileSelect,
        OnLoad
    }: MapMarkersProps) => {

    return (
        <>
            {locations.map((location,key) => (
                <MapMarker location={location} children={children} OnRemove={OnRemove} OnCenter={OnCenter} OnAddFile={OnAddFile} OnLoad={OnLoad} OnFileSelect={OnFileSelect} icon={icon} key={key} />
            ))};
        </>
    );

};
