import {useState} from "react";
import {UseJSAPI} from "../../../utils/";
import {DialogBox} from "../";

// If false, will only require username/password for login/registration
// If true, will require TOTP on login, and will show TOTP QR on registration
const SETTING_USE_TOTP = true;

type LoginProps = {
    OnFinish?: (success: boolean) => void;
}

export const LoginForm = ({
    OnFinish = (success) => {
        if (success) alert("Login successful!");
        else alert("Login failed...");
    }
}: LoginProps) => {

    const jsapi = UseJSAPI();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [TOTP, setTOTP] = useState("");
    const [mode, setMode] = useState("");
    const [qrCode, setQrCode] = useState("");

    const checkIfUser = (username: string) => {
        jsapi.IsUser(username).then((json: any) => {
            if (json.error && json.error == "No such user") {
                setMode("Register");
            }
            else if (!json.error)
            {
                setMode("Login");
            }
        });
    }

    const handleUsernameChange = (e: any) => {
        let newUsername = e.target.value;
        setUsername(newUsername);
        
        setTimeout(function() {
            if (newUsername === e.target.value) {
                if (newUsername !== "")
                    checkIfUser(newUsername);
                else
                    setMode("");
            }
        }, 1000);
    }

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    }

    const handleTOTPChange = (e: any) => {
        setTOTP(e.target.value);
    }

    const tryLogin = () => {
        jsapi.Login(username, password, TOTP).then(
            (json: any) => {
                OnFinish(true)
            },
            error => alert("error: " + error.status)
        );
    }

    const handleLogin = () => {
        if (mode === "Login") {
            if (SETTING_USE_TOTP)
                setMode("Login-TOTP");
            else
                tryLogin();
        }
        else if (mode === "Login-TOTP") {
            // TODO: verify totp
            tryLogin();
        }
        else if (mode === "Register") {
            jsapi.Register(username, password).then(
                (json: any) => {
                    console.log(json);
                    if (json.status && json.status === "OK" && json.qr_code) {
                        
                        if (SETTING_USE_TOTP) {
                            setQrCode(json.qr_code);
                            setMode("Register-TOTP");
                        }
                        else {
                            OnFinish(true);
                        }
                    }
                },
                error => alert("error: " + error.status)
            );
        }
        else if (mode === "Register-TOTP") {
            jsapi.CheckTOTP(TOTP).then(
                (json: any) => {
                    alert("Success!");
                },
                error => {
                    if (error.error) alert("Error: " + error.error);
                }
            );
            // TODO: verify totp
            //OnFinish(true);
        }
    }


    return(<>
        {(mode === "Login" || mode === "Register" || mode === "") ?
            <>
                <label>Username:</label>
                <input type="text" onChange={handleUsernameChange} />
                <label>Password:</label>
                <input type="password" onChange={handlePasswordChange} />
            </>
        : null
        }

        {(mode === "Register-TOTP" || mode == "Login-TOTP") ?
            <>
                <label>TOTP Code:</label>
                <input type="text" onChange={handleTOTPChange} />
            </>
        : null
        }

        {(mode === "Register-TOTP" || mode === "Register") ?
            <input type="submit" value="Register" onClick={handleLogin} />
        : null
        }

        {(mode === "Login-TOTP" || mode === "Login") ?
            <input type="submit" value="Login" onClick={handleLogin} />
        : null
        }
        
        {(mode === "Register-TOTP") ?
            <DialogBox title="TOTP QR">
                <img src={(new Image()).src = `data:image/png;base64,${qrCode}`} />
            </DialogBox>
        : null
        }
    </>);
}
