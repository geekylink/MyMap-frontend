import {MapManager} from './MapManager';

export const MapApp = () => {

    return (
        <>
            <MapManager />
        </>
    );
    //const [imgToShow, setImgToShow] = useState("");
    /*{((imgToShow !== "") ? 
                <div className="fullImgDiv" style={ {"width": "98vw", "height": "98vh", "float": "left", "position": "absolute",} }>
                    <img src={imgToShow} width={"100%"} height={"100%"} /> 
                </div>
                : null) 
            }*/
}

export default MapApp;
