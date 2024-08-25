import {
  addTaskComment,
  deleteTaskComment,
  getCommentsByTaskId,
  updateTaskComment,
} from "@/src/supabase/task_comment";
import { Task, TaskComment } from "@/src/types";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useGetCommentsByTaskId = (
  databaseId: string | undefined | null,
  taskId: string | undefined | null,
) => {
  return useQuery(
    ["databases", databaseId, "tasks", taskId, "comments"],
    () => (taskId ? getCommentsByTaskId(taskId) : Promise.resolve(null)),
    {
      enabled: !!(databaseId && taskId),
      refetchOnMount: false,
    },
  );
};

export const useAddTaskComment = (databaseId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation((comment: TaskComment) => addTaskComment(comment), {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["databases", databaseId, "tasks", taskId, "comments"],
      });
    },
  });
};

export const useDeleteTaskComment = (databaseId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation((commentId: string) => deleteTaskComment(commentId), {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["databases", databaseId, "tasks", taskId, "comments"],
      });
    },
  });
};

export const useUpdateTaskComment = (databaseId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, changes }: { id: string; changes: Partial<TaskComment> }) =>
      updateTaskComment(id, changes),
    {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["databases", databaseId, "tasks", taskId, "comments"],
        });
      },
    },
  );
};
