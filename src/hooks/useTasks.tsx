import { useMutation, useQueryClient } from "react-query";
import {
  addKanbanColumn,
  updateKanbanViewManualSort,
  deleteKanbanColumn,
} from "../utils/firestoreUtils";
import {
  Task,
  AggregateColumn,
  Database,
} from "../types";


export const useUpdateKanbanViewManualSort = (
  databaseId: string,
  viewId: string,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      columns,
      taskId,
      updatedTask,
    }: {
      columns: AggregateColumn[];
      taskId: string;
      updatedTask: Partial<Task>;
    }) => {
      return await updateKanbanViewManualSort(
        databaseId,
        viewId,
        columns,
        taskId,
        updatedTask,
      );
    },
    {
      onSuccess: (data) => {
        const previousDatabaseTasks = queryClient.getQueryData([
          "database-tasks",
          databaseId,
        ]) as Database & { tasks: Task[] };
        const view = previousDatabaseTasks.views.find(
          (view) => view.id === viewId,
        );
        view?.config?.groups &&
          (view.config.groups = data.columns.map((column) => ({
            group_by_value: column.title,
            task_order: column.tasks.map((task) => task.id as string),
          })));
        const updatedViews = previousDatabaseTasks.views.map((v) =>
          v.name === view?.name ? view : v,
        );

        queryClient.setQueryData<Database & { tasks: Task[] }>(
          ["database-tasks", databaseId],
          (old) => ({
            ...previousDatabaseTasks,
            views: updatedViews,
            tasks:
              old?.tasks.map((task) => {
                if (task?.id === data.id) {
                  return {
                    id: data.id,
                    database_id: data.updatedTask.database_id ?? "",
                    description: data.updatedTask.description ?? "",
                    properties: data.updatedTask.properties,
                    title: data.updatedTask.title,
                    created_at: data.updatedTask.created_at,
                    updated_at: data.updatedTask.updated_at,
                  } as Task;
                }
                return task;
              }) ?? [],
          }),
        );
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
      onSuccess: (newOption) => {
        const previousDatabaseTasks = queryClient.getQueryData([
          "database-tasks",
          databaseId,
        ]) as Database & { tasks: Task[] };
        const view = previousDatabaseTasks.views.find(
          (view) => view.name === viewName,
        );
        queryClient.setQueryData<Database & { tasks: Task[] }>(
          ["database-tasks", databaseId],
          (old) => ({
            ...previousDatabaseTasks,
            propertyDefinitions: previousDatabaseTasks.propertyDefinitions.map(
              (propDef) => {
                if (propDef.name === view?.config?.group_by) {
                  return {
                    ...propDef,
                    data: {
                      ...propDef.data,
                      options: [...(propDef.data?.options ?? []), newOption],
                    },
                  };
                }
                return propDef;
              },
            ),
            views: previousDatabaseTasks.views.map((view) => {
              if (view.name === viewName) {
                return {
                  ...view,
                  config: {
                    ...view.config,
                    groups: [
                      ...(view.config?.groups ?? []),
                      { group_by_value: newOption, task_order: [] },
                    ],
                  },
                };
              } else {
                return view;
              }
            }),
          }),
        );
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
      onSuccess: (optionToDelete) => {
        const previousDatabaseTasks = queryClient.getQueryData([
          "database-tasks",
          databaseId,
        ]) as Database & { tasks: Task[] };
        const view = previousDatabaseTasks.views.find(
          (view) => view.name === viewName,
        );
        queryClient.setQueryData<Database & { tasks: Task[] }>(
          ["database-tasks", databaseId],
          (old) => ({
            ...previousDatabaseTasks,
            propertyDefinitions: previousDatabaseTasks.propertyDefinitions.map(
              (propDef) => {
                if (propDef.name === view?.config?.group_by) {
                  return {
                    ...propDef,
                    data: {
                      ...propDef.data,
                      options:
                        propDef.data?.options?.filter(
                          (option) => option !== optionToDelete,
                        ) ?? [],
                    },
                  };
                }
                return propDef;
              },
            ),
            views: previousDatabaseTasks.views.map((view) => {
              if (view.name === viewName) {
                return {
                  ...view,
                  config: {
                    ...view.config,
                    groups: view.config?.groups?.filter(
                      (group) => group.group_by_value !== optionToDelete,
                    ),
                  },
                };
              } else {
                return view;
              }
            }),
          }),
        );
      },
    },
  );
};

export const useReorderColumn = () => {};