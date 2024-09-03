"use client";

import {
  useGetRequestById,
} from "@/src/hooks/react-query/request";
import {
  Box,
  Typography,
  List,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import {
  useGetCurrentUser,
} from "@/src/hooks/react-query/user";
import { StyledPaper } from "../../../components/StyledPaper";
import { v4 as uuidv4 } from "uuid";
import {
  useAddRequestComment,
  useDeleteRequestComment,
  useGetCommentsByRequestId,
  useUpdateRequestComment,
} from "@/src/hooks/react-query/request_comment";
import { RequestComment } from "@/src/components/RequestComment";
import { Send } from "@mui/icons-material";

interface RequestCommentsContainerProps {
  requestId: string;
}

export const RequestCommentsContainer: React.FC<
RequestCommentsContainerProps
> = ({ requestId }) => {
  const { data: request } = useGetRequestById(requestId);
  const { data: user } = useGetCurrentUser();
  const { data: comments } = useGetCommentsByRequestId(requestId);
  const addCommentMutation = useAddRequestComment(requestId);
  const deleteCommentMutation = useDeleteRequestComment(requestId);
  const updateCommentMutation = useUpdateRequestComment(requestId);
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = () => {
    addCommentMutation.mutate({
      id: uuidv4(),
      author_id: user?.id ?? "",
      request_id: request?.id ?? "",
      text: newCommentText,
    });
  };

  const handleCommentUpdate = (id: string, newText: string) => {
    updateCommentMutation.mutate({ id, changes: { text: newText }});
  }

  const handleCommentDelete = (id: string) => {
    deleteCommentMutation.mutate(id);
  }

  return (
    <StyledPaper sx={{ mt: 3, p: 3 }}>
        <Typography fontSize={18} fontWeight={600} gutterBottom mb={2}>
            Comments
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1}}>
        <TextField
            label="Comment"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            fullWidth
        />
        <IconButton
            color="primary"
            size="large"
            onClick={handleAddComment}
        >
            <Send />
        </IconButton>
        </Box>
        <List>
        {comments?.map((comment, index) => (
            <RequestComment
            key={index}
            comment={comment}
            onUpdate={handleCommentUpdate}
            onDelete={handleCommentDelete}
            />
        ))}
        </List>
    </StyledPaper>
  );
};
