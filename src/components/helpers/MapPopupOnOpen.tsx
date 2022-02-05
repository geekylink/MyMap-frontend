
type MapPopupOnOpen = {
    OnOpen: () => void;
};

export const MapPopupOnOpen = ({
    OnOpen,
}: MapPopupOnOpen) => {

    OnOpen();

    return null;
}

