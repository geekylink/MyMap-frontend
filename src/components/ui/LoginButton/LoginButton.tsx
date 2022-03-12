import {useState} from "react";
import {UseJSAPI} from "../../../utils/";
import {LoginForm} from "../";
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
    const [mode, setMode] = useState("LoginButton");
    const [popup, setPopup] = useState(false);

    let text = ((user === null) ? "Login (Or register)" : `Logout (${user.username})`);

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
                    setMode("LogoutButton")
                }
                else {
                    setUser(null);
                    setMode("LoginButton")
                    localStorage.setItem("user", JSON.stringify("[]"));
                }
                setChecked(true);
            },
            error => { console.log(error); } // Auth disabled?
        );
        return null;
    }

    const handleClick = () => {
        if (mode === "LoginButton") {
            setMode("Login");
            
        }
        else if (mode === "Login") {
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
        {(mode === "LoginButton" || mode == "LogoutButton") ?
            <button onClick={handleClick}>{text}</button>
        : 
            <LoginForm OnFinish={handleLogin} />
        }
    </>);
}
