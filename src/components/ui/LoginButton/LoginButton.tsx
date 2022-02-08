import {useState} from "react";
import axios from "axios";
import {UseJSAPI} from "../../../utils/";
import {DialogBox, LoginForm} from "../";

type LoginButtonProps = {
    OnFinish?: (success: boolean) => void;
}

export const LoginButton = ({
    OnFinish = (success) => {
        if (success) alert("File uploaded successfully!");
        else alert("File upload failed...");
    }
}: LoginButtonProps) => {

    const jsapi = UseJSAPI();

    const [username, setUsername] = useState("");
    const [checked, setChecked] = useState(false);
    const [popup, setPopup] = useState(false);

    let text = ((username == "") ? "Login" : `Logout (${username})`);

    // Fetch username to check if logged in
    if (!checked) {
        jsapi.CheckLogin().then(
            result => {
                // Filter out long response (ie. from dev server)
                if (("" + result).length < 128) {
                    setUsername("" + result);
                    setChecked(true);
                }
            },
            error => { console.log(error); } // Auth disabled?
        );
        return null;
    }

    const handleClick = () => {
        if (text == "Login") {
            setPopup(true);
        }
        else {
            jsapi.Logout().then(function(resp) {
                setUsername("");
            });
        }
    }

    const handleLogin = (success: boolean) => {
        if (success) {
            setPopup(false);
            setChecked(false);
        }
    }

    return(<>
        <button onClick={handleClick}>
        {text}
        </button>
        {(popup) ? 
            <DialogBox title="Login">
                <LoginForm OnFinish={handleLogin} />
            </DialogBox>
            : null
        }

    </>);
}
