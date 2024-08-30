import {
  addDatabaseView,
  addKanbanColumn,
  deleteDatabaseView,
  deleteKanbanColumn,
  getDatabaseViewById,
  getViewTaskOrdersByViewId,
  updateDatabaseView,
  updateKanbanViewManualSort,
} from "@/src/supabase/database_view";
import {
  addKanbanTask,
  deleteKanbanTask,
  updateTask,
} from "@/src/supabase/task";
import { AggregateColumn, DatabaseView, Task } from "@/src/types";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useUpdateDatabaseView = (databaseId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, changes }: { id: string; changes: Partial<DatabaseView> }) =>
      updateDatabaseView(id, changes),
    {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["databases", databaseId, "views"],
        });
      },
    },
  );
};

export const useGetDatabaseViewById = (databaseId: string | undefined | null, viewId: string | undefined | null) => {
  return useQuery(
    ["databases", databaseId, 'views', viewId],
    () => (viewId ? getDatabaseViewById(viewId) : Promise.resolve(null)),
    {
      enabled: !!(viewId && databaseId), // only run the query if id is truthy
      staleTime: 60000,
    },
  );
};

export const useAddDatabaseView = (database_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (databaseView: DatabaseView) => {
      try {
        const addedView = await addDatabaseView(databaseView);
        return addedView;
      } catch (err) {
        console.warn(err);
        throw err;
      }
    },
    {
      onSettled: (_, variables) => {
        queryClient.refetchQueries(["databases", database_id, "views"]);
      },
    },
  );
};

export const useDeleteDatabaseView = (databaseId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation(async (id: string) => deleteDatabaseView(id), {
    onSettled: (_, variables) => {
      queryClient.invalidateQueries(["databases", databaseId, "views"]);
    },
  });
};

export const useDeleteKanbanTask = (databaseId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ viewId, taskToDelete }: { viewId: string, taskToDelete: Task }) => {
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

export const useGetViewTaskOrdersByViewId = (viewId: string | undefined) => {
  return useQuery(
    ["view-task-order"],
    () => (viewId ? getViewTaskOrdersByViewId(viewId) : Promise.resolve(null)),
    {
      enabled: !!viewId, // only run the query if id is truthy
      staleTime: 60000,
    },
  );
};

// Add a new task
export const useAddKanbanTask = (databaseId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ task, afterTaskId, viewId }: { task: Task, afterTaskId: string | null, viewId: string }) => {
      try {
        const addedTask = await addKanbanTask(task, viewId, afterTaskId);
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
  databaseId: string | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, viewId, changes }: { id: string; viewId: string, changes: Partial<Task> }) =>
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
  databaseId: string | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      viewId,
      columns,
      taskId,
      taskChanges,
    }: {
      viewId: string;
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

export const useAddKanbanColumn = (databaseId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      newOption,
      viewName,
      databaseId
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

export const useDeleteKanbanColumn = (databaseId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      optionToDelete,
      viewName,
      databaseId
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
