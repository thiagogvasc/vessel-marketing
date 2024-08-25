import {
  addKanbanColumn,
  deleteKanbanColumn,
  updateKanbanViewManualSort,
} from "@/src/supabase/database_view";
import {
  addKanbanTask,
  deleteKanbanTask,
  updateTask,
} from "@/src/supabase/task";
import { AggregateColumn, Task } from "@/src/types";
import { useMutation, useQueryClient } from "react-query";

export const useDeleteKanbanTask = (databaseId: string, viewId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (taskToDelete: Task) => {
      try {
        console.warn("calling delete task");
        const deletedTask = await deleteKanbanTask(taskToDelete, viewId);
        return deletedTask;
      } catch (err) {
        console.warn(err);
        throw err;
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["databases", databaseId, "tasks"]);
        queryClient.invalidateQueries(["databases", databaseId, "views"]);
      },
    },
  );
};

// Add a new task
export const useAddKanbanTask = (databaseId: string, viewId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (task: Task) => {
      try {
        const addedTask = await addKanbanTask(task, viewId);
        return addedTask;
      } catch (err) {
        console.warn(err);
        throw err;
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["databases", databaseId, "tasks"]);
        queryClient.invalidateQueries(["databases", databaseId, "views"]);
      },
    },
  );
};

// Update an existing task
export const useUpdateTask = (
  databaseId: string,
  taskId: string,
  viewId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, changes }: { id: string; changes: Partial<Task> }) =>
      updateTask(id, changes, viewId),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["databases", databaseId, "tasks"]);
        queryClient.invalidateQueries(["databases", databaseId, "views"]);
      },
    },
  );
};

export const useUpdateKanbanViewManualSort = (
  databaseId: string,
  viewId: string,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      columns,
      taskId,
      taskChanges,
    }: {
      columns: AggregateColumn[];
      taskId: string;
      taskChanges: Partial<Task>;
    }) => {
      return await updateKanbanViewManualSort(
        viewId,
        columns,
        taskId,
        taskChanges,
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["databases", databaseId, "tasks"]);
        queryClient.invalidateQueries(["databases", databaseId, "views"]);
      },
    },
  );
};

export const useAddKanbanColumn = (databaseId: string, viewName: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      newOption,
    }: {
      databaseId: string;
      viewName: string;
      newOption: string;
    }) => {
      const newColumn = await addKanbanColumn(databaseId, viewName, newOption);
      return newColumn as string;
    },
    {
      onSettled: () => {
        console.warn("invalidating property definitions");
        queryClient.invalidateQueries(["databases", databaseId, "tasks"]);
        queryClient.invalidateQueries(["databases", databaseId, "views"]);
        queryClient.invalidateQueries([
          "databases",
          databaseId,
          "property-definitions",
        ]);
      },
    },
  );
};

export const useDeleteKanbanColumn = (databaseId: string, viewName: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      optionToDelete,
    }: {
      databaseId: string;
      viewName: string;
      optionToDelete: string;
    }) => {
      const deletedOption = await deleteKanbanColumn(
        databaseId,
        viewName,
        optionToDelete,
      );
      return deletedOption as string;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["databases", databaseId, "tasks"]);
        queryClient.invalidateQueries(["databases", databaseId, "views"]);
        queryClient.invalidateQueries([
          "databases",
          databaseId,
          "property-definitions",
        ]);
      },
    },
  );
};
