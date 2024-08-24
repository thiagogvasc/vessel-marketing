import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchTasks,
  addTask,
  updateTask,
  fetchBoard,
  updateTaskOrder,
  fetchAggregateBoard,
  getDatabaseTasks,
  getDatabaseById,
  addKanbanColumn,
  updateKanbanViewManualSort,
  deleteTask,
  deleteKanbanColumn,
} from "../utils/firestoreUtils";
import {
  Task,
  Column,
  AggregateColumn,
  AggregateBoard,
  Database,
  PropertyType,
  GroupByGroup,
} from "../types";
import { Updater } from "react-query/types/core/utils";

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

// Update an existing task
export const useUpdateTask = (databaseId: string, viewName: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      id,
      updatedTask,
    }: {
      id: string;
      updatedTask: Partial<Omit<Task, "id" | "created_at">>;
    }) => updateTask(id, updatedTask, databaseId, viewName),
    {
      onSuccess: (updatedTaskData, variables) => {
        const previousDatabaseTasks = queryClient.getQueryData([
          "database-tasks",
          databaseId,
        ]) as Database & { tasks: Task[] };
        const newViews = previousDatabaseTasks.views.map((view) => {
          const changedProperties = updatedTaskData.updatedTask.properties;
          if (!changedProperties) return view;

          Object.keys(changedProperties).forEach((propertyName) => {
            if (view.config?.group_by === propertyName) {
              // Remove task from the old group
              let indexToRemove = -1;
              let groupToRemoveTaskFrom: GroupByGroup | null = null;
              view.config.groups?.forEach((group) => {
                const taskIndex = group.task_order.indexOf(updatedTaskData.id);
                if (taskIndex !== -1) {
                  indexToRemove = taskIndex;
                  groupToRemoveTaskFrom = group;
                }
              });

              if (indexToRemove !== -1 && groupToRemoveTaskFrom) {
                (groupToRemoveTaskFrom as GroupByGroup).task_order.splice(
                  indexToRemove,
                  1,
                );
              }

              // Add task to the new group
              const newGroupByValue = changedProperties[view.config.group_by];
              const newGroup = view.config.groups?.find(
                (group) => group.group_by_value === newGroupByValue,
              );

              if (newGroup) {
                newGroup.task_order.push(updatedTaskData.id);
              } else {
                // If the group does not exist, create it
                view.config.groups = [
                  ...(view.config.groups || []),
                  {
                    group_by_value: newGroupByValue,
                    task_order: [updatedTaskData.id],
                  },
                ];
              }
            }
          });

          return view;
        });

        queryClient.setQueryData<Database & { tasks: Task[] }>(
          ["database-tasks", databaseId],
          (old) => ({
            ...previousDatabaseTasks,
            views: newViews,
            tasks:
              old?.tasks.map((task) => {
                if (task?.id === updatedTaskData.id) {
                  return {
                    id: updatedTaskData.id,
                    database_id: updatedTaskData.updatedTask.database_id ?? "",
                    description: updatedTaskData.updatedTask.description ?? "",
                    properties: updatedTaskData.updatedTask.properties,
                    title: updatedTaskData.updatedTask.title,
                    created_at: updatedTaskData.updatedTask.created_at,
                    updated_at: updatedTaskData.updatedTask.updated_at,
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
