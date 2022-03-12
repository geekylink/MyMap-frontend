// Convert rust response to JS
export const newComment = (comment: any) => {
    return {
        id: comment.id,
        msg: comment.comment,
        author: {
            username: comment.user.username,
            groupName: comment.user.group.group_name,
        },
        replyToId: comment.reply_to_id,
        postedDate: comment.posted_date,
        lastEditDate: comment.last_edit_date,
    };
}