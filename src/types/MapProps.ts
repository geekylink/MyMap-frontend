
type Point = {
    x: number;
    y: number;
}

// LatLng properties
class LatLngProps {
    public readonly lat: number;
    public readonly lng: number;

    constructor(latlng: {lat: number, lng: number}) {
        this.lat = latlng.lat;
        this.lng = latlng.lng;
    }
}

// LatLng class with some helper functions ontop of LatLngProps
class LatLng extends LatLngProps {
    public toAr():[number, number] {
        return [this.lat, this.lng];
    }
}

// leaflet map functions we need access to
type LeafletMapProps = {
    getCenter:              () => LatLngProps;
    getSize:                () => Point;

    containerPointToLatLng: (point: [number, number]) => LatLngProps;
};

export class MapProps {
    // Map viewport
    public readonly center:     LatLng;
    public readonly topLeft:    LatLng;
    public readonly bottomRight:LatLng;

    // Pixel height/width
    public readonly mapHeight:  number;
    public readonly mapWidth:   number;

    public readonly mapObj: LeafletMapProps; // Just thought this might be cool/useful lol

    constructor(map: LeafletMapProps) {  
        let size = map.getSize();

        this.mapObj = map;

        this.mapHeight  = size.y;
        this.mapWidth   = size.x;

        this.bottomRight    = new LatLng(map.containerPointToLatLng([size.x, size.y])); 
        this.topLeft        = new LatLng(map.containerPointToLatLng([0,0]));
        this.center         = new LatLng(map.getCenter());
    }
};

