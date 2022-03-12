import {UserInfo} from "../../types/";

export const UserHasPermission = (permission: string) => {
    let userString = localStorage.getItem("user");
    if (!userString) {
        return false;
    }

    let user: UserInfo = JSON.parse(userString);

    if (user && user.permissions) {
        let permissions = user.permissions;
        if (permissions === "*") {
            return true;
        }
        if (permissions.includes(permission)) {
            return true;
        }
    }

    return false;
}