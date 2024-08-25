import React, { useState } from "react";
import { Box, TextField, Button, List } from "@mui/material";
import { TaskComment } from "./TaskComment";
import { TaskComment as TaskCommentType } from "../../types";

interface TaskCommentsProps {
  comments: TaskCommentType[];
  commentAdded?: (commentText: string) => void;
  commentUpdated?: (id: string, newText: string) => void;
  commentDeleted?: (id: string) => void;
}

export const TaskComments = ({
  comments,
  commentAdded,
  commentUpdated,
  commentDeleted,
}: TaskCommentsProps) => {
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = () => {
    if (newCommentText.trim() !== "") {
      commentAdded?.(newCommentText);
      setNewCommentText("");
    }
  };

  const handleCommentUpdate = (id: string, newText: string) => {
    commentUpdated?.(id, newText);
  }

  const handleCommentDelete = (id: string) => {
    commentDeleted?.(id);
  }

  return (
    <Box>
      <TextField
        label="Comment"
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddComment}
        style={{ marginTop: "10px" }}
      >
        Add Comment
      </Button>
      <List>
        {comments.map((comment, index) => (
          <TaskComment
            key={index}
            comment={comment}
            onUpdate={handleCommentUpdate}
            onDelete={handleCommentDelete}
          />
        ))}
      </List>
    </Box>
  );
};
