import {useRef, useState} from "react";
import "./DialogFullScreen.css";

type DialogFullScreenProps = {
    title: string;
    message?: string;
    children?: React.ReactNode;
    OnClose?: () => void;
    OnSubmit?: (msg: string) => void;
    showCopy?: boolean;
};

export const DialogFullScreen = ({
    title,
    message,
    children,
    OnClose,
    OnSubmit,
    showCopy = false 
}: DialogFullScreenProps) => {

    const messageRef = useRef<HTMLTextAreaElement>(null);

    const [isDone, setIsDone] = useState(false);

    const selectAllText = () => {
        if (messageRef.current) {
            let val = messageRef.current.value;

            messageRef.current.select();
            messageRef.current.setSelectionRange(0, val.length); //mobile?
            navigator.clipboard.writeText(val);
        }
    };

    if (OnClose == undefined) {
        OnClose = () => { setIsDone(true); }
    }

    if (isDone) return null;
    else {
        return (
            <div className="DialogFullScreen">
                {title}:
                {(showCopy) ? <button onClick={selectAllText}>Copy</button> : null}
                <button onClick={OnClose}>X</button><br/>
                {(message) ? <textarea ref={messageRef}>{message}</textarea> : null}

                {(OnSubmit) ? <button onClick={() => { 
                                                        if (messageRef.current) OnSubmit(messageRef.current.value);
                                                        if (OnClose) OnClose();
                                                     }}>Submit</button> : null}

                <hr/>
                {children}
            </div>
        );
    }
}
