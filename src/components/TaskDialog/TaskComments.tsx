import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { TaskComment } from "../../types";

interface TaskCommentsProps {
  comments: TaskComment[];
  commentAdded?: (commentText: string) => void;
}

export const TaskComments = ({ comments, commentAdded }: TaskCommentsProps) => {
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = () => {
    if (newCommentText.trim() !== "") {
      commentAdded?.(newCommentText);
      setNewCommentText("");
    }
  };

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
          <ListItem key={index}>
            <ListItemText primary={comment.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
