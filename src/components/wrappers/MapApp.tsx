import {useState} from 'react';

import {MapManager} from './MapManager';

export const MapApp = () => {

    
    const [imgToShow, setImgToShow] = useState("");

    return (
        <>
            {((imgToShow != "") ? 
                <div className="fullImgDiv" style={ {"width": "98vw", "height": "98vh", "float": "left", "position": "absolute",} }>
                    <img src={imgToShow} width={"100%"} height={"100%"} /> 
                </div>
                : null) 
            }
            <MapManager />
        </>
    );
                    //<img src={imgToShow} width={"100%"} height={"100%"} /> 
}

export default MapApp;
