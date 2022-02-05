import {useState} from "react";
import axios from "axios";
import {UseJSAPI} from "../../../utils/";

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

    const handleUsernameChange = (e: any) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    }

    const handleLogin = () => {
        //jsapi.Login(username, password);
        //jsapi.Login(username, password).then(function(json: any) {
        jsapi.Login(username, password).then(
            result => OnFinish(true),
            error => alert("error: " + error.status)
        );
    }


    return(<>
        <div>Login Form</div>
        <label>Username:</label>
        <input type="text" onChange={handleUsernameChange} /><br/>
        <label>Password:</label>
        <input type="password" onChange={handlePasswordChange} /><br/>

        <input type="submit" value="Login" 
                onClick={handleLogin} 
        />
        
    </>);
}
