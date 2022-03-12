import {useState} from "react";
import {UseJSAPI} from "../../../utils/";
import {CommentData} from "../../../types";

import {AddComment, Comment} from "./";
import {newComment} from "./Comments.functions";

import "./Comments.css";

type CommentsProps = {
    fileId?: number,
    locationId?: number,
};

export const Comments = ({
    fileId = -1,
    locationId = -1,
}: CommentsProps) => {
    const jsapi = UseJSAPI();

    const [checked, setChecked] = useState(false);
    const [comments, setComments] = useState<CommentData[]>([]);

    if ((fileId === -1 && locationId === -1) || (fileId !== -1 && locationId !== -1)) {
        console.log("Error: comments should be either on a file or location");
        return null;
    }

    const fetchComments = (json: any) => {
        console.log(json);
        if (json.status && json.status === "OK" && json.comments) {
            let newComments = comments;
            json.comments.forEach((comment: /*CommentData*/ any) => {
                newComments.push(newComment(comment));
            });
            setComments([...newComments]);
        }
    }

    if (!checked) {
        setChecked(true);
        if (fileId !== -1) {
            jsapi.GetCommentsOnFile(fileId).then(fetchComments);
        }
        if (locationId !== -1) {
            jsapi.GetCommentsOnLocation(locationId).then(fetchComments);
        }
        return null;
    }

    return (<>
        <div className="Comments">
            {comments.map((comment: CommentData) => {
                return (
                    <Comment comment={comment} fileId={fileId} locationId={locationId} />
                );
            })}
        </div>
        <AddComment fileId={fileId} locationId={locationId} />
    </>);
}