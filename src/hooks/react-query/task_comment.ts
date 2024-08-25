import { getCommentsByTaskId } from "@/src/supabase/task_comment";
import { useQuery } from "react-query";

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
