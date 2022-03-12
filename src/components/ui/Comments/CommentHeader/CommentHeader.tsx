import {CommentData} from "../../../../types";
import {UserHasPermission} from "../../../../utils/";

type CommentHeaderProps = {
    comment: CommentData;
    OnEditClick: () => void;
};

export const CommentHeader = ({
    comment,
    OnEditClick,
}: CommentHeaderProps) => {
    let user = localStorage.getItem("user");
    let myUsername = (user) ? JSON.parse(user).username : "";

    //console.log(new Date(comment.postedDate * 1000).toLocaleString());
    //console.log(new Date(comment.postedDate * 1000).toLocaleString("en-US", {timeZone: "EST"}));
    return (<div className="CommentHeader">
        {(comment.author) ? 
            `Posted by ${comment.author.username}` 
            : null
        }
        {(comment.author) ? 
            ` (${comment.author.groupName})` 
            : null
        }
        {(comment.postedDate) ? 
            " On: " + new Date(comment.postedDate*1000).toLocaleString() 
            : null
        }
        {(comment.lastEditDate && comment.lastEditDate !== -1) ? 
            ` (Edited: ${new Date(comment.lastEditDate*1000).toLocaleString()})`
            : null
        }

        {(UserHasPermission("editAnyComment") || 
         (UserHasPermission("editComment") && comment.author?.username == myUsername )) 
            ?
                <span><a onClick={OnEditClick}>Edit</a>&nbsp;</span>
            :
                null
        }
    </div>);
}