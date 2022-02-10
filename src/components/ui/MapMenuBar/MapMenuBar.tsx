import {useState} from "react";
import {LocationSearch, LoginButton} from "../";
import {LocationData} from "../../../types";

import "./MapMenuBar.css"

type MapMenuProps = {
    OnSearchResult?: (locations: LocationData[]) => void;
    OnExport?: () => void;
    OnImport?: () => void;
    OnLogin?: (success: boolean) => void;
};

export const MapMenuBar = ({
    OnSearchResult,
    OnExport,
    OnImport,
    OnLogin,
}: MapMenuProps) => {


    return (
        <>
        <div className="MapMenuBar">
            {(OnSearchResult) ? <LocationSearch OnSearchResult={OnSearchResult} /> : null}
            {(OnExport) ? <button onClick={OnExport}>Export!</button> : null}
            {(OnImport) ? <button onClick={OnImport}>Import!</button> : null}
            <LoginButton OnLogin={OnLogin} />
        </div>
        </>
    );
}
