export interface CommentData {
    id?: number; // Unknown at time of posting
    msg: string;
    author?: { // Could get this info from local storage perhaps, need to be logged in to post anyway
        username: string,
        groupName: string,
    }
    postedDate?: number; // Unknown at time of posting
    lastEditDate?: number; // Only needed for edits
    replyToId: number;
}
