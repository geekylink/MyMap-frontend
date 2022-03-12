import {useState} from "react";
import {CommentData} from "../../../../types";
import {UseJSAPI, UserHasPermission} from "../../../../utils/";

import {newComment} from "../Comments.functions";

import {AddComment, CommentHeader} from "../";

type CommentProps = {
    comment: CommentData;
    fileId?: number,
    locationId?: number,
};

export const Comment = ({
    comment,
    fileId = -1,
    locationId = -1,
}: CommentProps) => {
    const jsapi = UseJSAPI();
    const [isEdit, setIsEdit] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [replies, setReplies] = useState<CommentData[] | undefined>(undefined);

    const handleEditLinkClick = () => {
        setIsEdit(!isEdit);
    }

    const addReplies = (json: any) => {
        let newReplies: CommentData[] = [];
        json.comments.forEach((comment: any) => {
            newReplies.push(newComment(comment));
        });
        console.log(newReplies);
        setReplies([...newReplies]);
    }

    if (replies === undefined && comment.id) {
        jsapi.GetReplies(comment.id).then(addReplies);
    }

    return (<div className="Comment">
        <CommentHeader comment={comment} OnEditClick={handleEditLinkClick} />

        {(isEdit) ?
                <AddComment 
                        editId={comment.id!}
                        startMode="EditComment"
                        startText={comment.msg}
                        OnFinish={() => {
                            setIsEdit(false);
                        }}
                />
            :
                <div>{comment.msg}</div>
        }

        {(UserHasPermission("addComment") && !isReply) ?
                <a onClick={() => {setIsReply(true)}}>Reply</a>
            :
               null
        }

        {(isReply) ?
                <AddComment fileId={fileId} 
                            locationId={locationId} 
                            replyToId={comment.id!} 
                            startMode="AddComment" 
                            OnFinish={() => {
                                setIsReply(false);
                            }} 
                />
            :
                null
        }

        {(replies) 
            ?
                <div className="Replies">
                    {replies.map((comment: CommentData) => {
                        return (
                            <Comment comment={comment} fileId={fileId} locationId={locationId} />
                        );
                    })}
                </div>
            : 
                null
        }
    </div>);
}