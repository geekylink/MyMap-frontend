import {LocationData, CommentData} from "../../types/";

//const HTTP_SERVER = "http://localhost:8080";
const HTTP_SERVER = "";

/*** API Helpers ***/
const JSONAPICall = (url: string, body: string) => {
    // POSTs JSON and returns a promise that fetches the JSON response

    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
    }

    return new Promise((resolve, reject) => {
        fetch(HTTP_SERVER + url, reqOptions).then(response => {

            // Bad response, don't try to parse
            if (!response.ok) {
                reject(response);
                return;
            }

            response.json().then(json => {
                if (json.status === "OK") resolve(json);
                reject(json);
            })
        });
    });
}

const GETAPICall = (url: string, doParse: boolean) => {
    // Makes a GET request and returns JSON data
    const reqOptions = {
        method: 'GET',
    }

    return new Promise((resolve, reject) => {
        fetch(HTTP_SERVER + url, reqOptions).then(response => {
            // Bad response
            if (!response.ok) {
                reject(response);
                return;
            }

            response.text().then(resp => {
                if (doParse) {
                    let jsonResp = JSON.parse(resp);
                    resolve(jsonResp);
                } else {
                    resolve(resp);
                }
            });
        });
    });
}

/*** End of API Helpers ***/

/*** API Calls ***/
const Login = (username: string, password: string, totp: string) => {
    // JSON Login
    if (totp !== "") { // Only send TOTP if used
        return JSONAPICall("/user/login/", 
                JSON.stringify({ 
                    username: username,
                    password: password,
                    totp_code: totp,
                }));
    }

    return JSONAPICall("/user/login/", 
                JSON.stringify({ 
                    username: username,
                    password: password,
                }));
}

const Register = (username: string, password: string) => {
    // JSON Login
    return JSONAPICall("/user/register/", 
                        JSON.stringify({ 
                            username: username,
                            password: password,
                        }));
}

const Logout = () => {
    return GETAPICall("/user/logout/", false);
}

const CheckLogin = () => {
    return GETAPICall("/user/", true);
}

const CheckTOTP = (totp: string) => {
    return JSONAPICall("/user/totp/", 
                        JSON.stringify({ 
                            totp_code: totp,
                        }));
}

const IsUser = (username: string) => {
    // Fetch filenames (photos) for a location
    return GETAPICall("/user/isUser/" + username + "/", true);
}

const GetFileInfo = (filename: string) => {
    // Fetches info for a file
    return JSONAPICall("/api/getFileInfo/", 
                        JSON.stringify({ 
                            filename: filename,
                        }));
}

const GetAllLocations = () => {
    // Fetch filenames (photos) for a location
    return GETAPICall("/api/getAllLocations/", true);
}

const GetLocationFiles = (locationId: number) => {
    // Fetch filenames (photos) for a location
    return JSONAPICall("/api/getLocationFiles/", 
                        JSON.stringify({ 
                            id: locationId,
                        }));
}

const SaveLocation = (location: LocationData) => {
    // Saves location data to the database
    return JSONAPICall("/api/saveLocation/", 
                        JSON.stringify({ 
                            label: location.label,
                            lat: location.lat,
                            lon: location.lon,
                            location_type: location.type,
                        }));
}

const AddCommentOnFile = (comment: CommentData, fileId: number) => {
    return JSONAPICall("/api/addComment/", 
                        JSON.stringify({ 
                            comment: comment.msg,
                            file_id: fileId,
                            reply_to_id: comment.replyToId,
                        }));
}

const AddCommentOnLocation = (comment: CommentData, locationId: number) => {
    return JSONAPICall("/api/addComment/", 
                        JSON.stringify({ 
                            comment: comment.msg,
                            location_id: locationId,
                            reply_to_id: comment.replyToId,
                        }));
}

const EditComment = (comment: CommentData, comment_id: number) => {
    return JSONAPICall("/api/addComment/", 
                        JSON.stringify({ 
                            comment: comment.msg,
                            id: comment_id,
                        }));
}

const GetCommentsOnLocation = (locationId: number) => {
    // Fetch comments for a location
    return GETAPICall("/api/getCommentsOnLocation/" + locationId + "/", true);
}

const GetCommentsOnFile = (fileId: number) => {
    // Fetch comments for a location
    return GETAPICall("/api/getCommentsOnFile/" + fileId + "/", true);
}

// Fetch all replies
const GetReplies = (replyId: number) => {
    return GETAPICall("/api/getReplies/" + replyId + "/", true);
}

/*** End of API Calls ***/

export const UseJSAPI = () => {
    // Returns API Calls available
    return {
        // Comments
        "AddCommentOnFile":         AddCommentOnFile,
        "AddCommentOnLocation":     AddCommentOnLocation,
        "EditComment":              EditComment,
        "GetCommentsOnFile":        GetCommentsOnFile,
        "GetCommentsOnLocation":    GetCommentsOnLocation,
        "GetReplies":               GetReplies,

        "GetAllLocations":          GetAllLocations,
        "GetFileInfo":              GetFileInfo,
        "GetLocationFiles":         GetLocationFiles,
        "SaveLocation":             SaveLocation,

        // User functions
        "CheckLogin":       CheckLogin,
        "CheckTOTP":        CheckTOTP,
        "IsUser":           IsUser,
        "Login":            Login,
        "Logout":           Logout,
        "Register":         Register,
    }
}

