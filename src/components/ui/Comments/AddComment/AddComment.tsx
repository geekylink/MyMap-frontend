import {useState} from "react";

import {UseJSAPI, UserHasPermission} from "../../../../utils/";
import {CommentData} from "../../../../types";

import "./AddComment.css";

type AddCommentProps = {
    fileId?:        number,
    locationId?:    number,
    replyToId?:     number,
    editId?:        number,
    startMode?:     string,
    startText?:     string,
    OnFinish?:      (posted: boolean) => void,
};

// Modes: AddCommentButton -> AddComment
// EditComment

export const AddComment = ({
    fileId = -1,
    locationId = -1,
    replyToId = -1,
    editId = -1,
    startMode = "AddCommentButton", 
    startText,
    OnFinish,
}: AddCommentProps) => {
    const jsapi = UseJSAPI();

    const [mode, setMode] = useState(startMode);
    const [message, setMessage] = useState("");

    const handleAddCommentClick = () => {
        setMode("AddComment");
    }

    const onPostFinish = () => {
        if (OnFinish) OnFinish(false);
        setMode(startMode);
        alert("Posted!");
    }

    const handlePost = () => {
        console.log(message);
        let comment: CommentData = {
            msg: message,
            replyToId: replyToId,
        };

        if (mode === "EditComment") {
            jsapi.EditComment(comment, editId).then(onPostFinish);
        }
        else {
            if (fileId !== -1) {
                jsapi.AddCommentOnFile(comment, fileId).then(onPostFinish);
            }
            if (locationId !== -1) {
                jsapi.AddCommentOnLocation(comment, locationId).then(onPostFinish);
            }
        }
    }

    const handleCancel = () => {
        if (OnFinish) OnFinish(false);
        setMode(startMode);
    }

    const handleCommentChange = (e: any) => {
        setMessage(e.target.value);
    }

    // Can this user add a comment?
    if (!UserHasPermission("addComment")) {
        console.log("Do not have permission to add comments")
        return null;
    }

    if (mode === "EditMode" && !UserHasPermission("editComment")) {
        console.log("Do not have permission to edit comments");
        return null;
    }

    if (fileId === -1 && locationId === -1 && editId === -1) {
        console.log("Adding a comment must be on a file or location, or editing an existing comments");
        return null;
    }

    return (<>
        <hr/>

        {(mode === "AddCommentButton") ? 
            <button onClick={handleAddCommentClick}>Add Comment</button> 
            : null
        }

        {(mode === "AddComment" || mode === "EditComment") ?
            <div className="NewComment">
                {(replyToId !== -1) ? 
                        <label>{(mode === "EditComment") ? "Edit " : ""}Reply:</label> 
                    : 
                        <label>{(mode === "EditComment") ? "Edit " : ""}Comment:</label>
                }
                <br/>
                <textarea onChange={handleCommentChange}>{(startText) ? startText : null}</textarea><br/>
                <button onClick={handlePost}>Post!</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
            : null
        }
    </>);
}