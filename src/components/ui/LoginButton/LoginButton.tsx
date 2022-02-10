import {useState} from "react";
import axios from "axios";
import {UseJSAPI} from "../../../utils/";
import {DialogBox, LoginForm} from "../";
import {UserInfo} from "../../../types";

type LoginButtonProps = {
    OnLogin?: (success: boolean) => void;
}

export const LoginButton = ({
    OnLogin = (success) => {
        //if (success) alert("Logged in!");
        //else alert("Failed to login");
    }
}: LoginButtonProps) => {

    const jsapi = UseJSAPI();

    //const [username, setUsername] = useState("");
    const [user, setUser] = useState<UserInfo|null>(null);
    const [checked, setChecked] = useState(false);
    const [popup, setPopup] = useState(false);

    let text = ((user === null) ? "Login" : `Logout (${user.username})`);

    // Fetch username to check if logged in
    if (!checked) {
        jsapi.CheckLogin().then(
            (json: any) => {
                // Filter out long response (ie. from dev server)
                if (json.username) {
                    let user = {
                        username: json.username,
                        groupName: json.group.group_name,
                        permissions: json.group.permissions,
                    };

                    localStorage.setItem("user", JSON.stringify(user));

                    setUser(user);
                }
                else {
                    setUser(null);
                }
                setChecked(true);
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
                localStorage.setItem("user", JSON.stringify([]));
                setUser(null);
                window.location.reload();
            });
        }
    }

    const handleLogin = (success: boolean) => {
        if (success) {
            setPopup(false);
            setChecked(false);
            OnLogin(true);
            window.location.reload();
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
