
type MapPopupOnOpenProps = {
    OnOpen: () => void;
};

export const MapPopupOnOpen = ({
    OnOpen,
}: MapPopupOnOpenProps) => {

    OnOpen();

    return null;
}

