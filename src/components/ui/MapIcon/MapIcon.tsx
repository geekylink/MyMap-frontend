import L from "leaflet";

export const MapIcon = (color: string) => {
    const colors = ["black", "blue", "brown", "green", "lightgreen", "orange", "pink", "purple", "red", "white", "yellow" ];

    if (!colors.includes(color)) {
        console.log("Color '" + color + "' not an available icon");
        console.log("Color options are: ", colors);
        throw new Error("Bad color: " + color + "\n\nOptions are:\n" + colors);
    }

    return new L.Icon({
        iconUrl: `img/icons/${color}-icon.png`,
        iconAnchor: [16, 32],
        popupAnchor: [0, -23],
        iconSize: new L.Point(32, 32),
    })
};
