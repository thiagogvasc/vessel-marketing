import React from "react";
import {
  useAddTaskComment,
  useDeleteTaskComment,
  useGetCommentsByTaskId,
  useUpdateTaskComment,
} from "../hooks/react-query/task_comment";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { TaskComment } from "../types";
import { TaskComments } from "../components/TaskDialog/TaskComments";

interface TaskCommentsContainerProps {
  database_id: string | undefined;
  task_id: string | undefined;
}

export const TaskCommentsContainer = ({
  database_id,
  task_id,
}: TaskCommentsContainerProps) => {
  const { user } = useAuth();
  const { data: comments } = useGetCommentsByTaskId(database_id, task_id);
  const addCommentMutation = useAddTaskComment(database_id, task_id);
  const updateCommentMutation = useUpdateTaskComment(database_id, task_id);
  const deleteCommentMutation = useDeleteTaskComment(database_id, task_id);

  const handleCommentAdded = (commentText: string) => {
    if (!user || !task_id) return;
    const newComment: TaskComment = {
      id: uuidv4(),
      author_id: user.id,
      task_id,
      text: commentText,
    };
    addCommentMutation.mutateAsync(newComment);
  };

  const handleCommentDelete = (commentId: string) => {
    deleteCommentMutation.mutateAsync(commentId);
  };

  const handleCommentUpdate = (id: string, newText: string) => {
    updateCommentMutation.mutateAsync({ id, changes: { text: newText } });
  };

  return (
    <TaskComments
      comments={comments ?? []}
      commentAdded={handleCommentAdded}
      commentDeleted={handleCommentDelete}
      commentUpdated={handleCommentUpdate}
    />
  );
};
