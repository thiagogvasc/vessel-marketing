import {
  addKanbanTask,
  deleteKanbanTask,
  updateTask,
} from "@/src/supabase/task";
import { addTaskComment } from "@/src/supabase/task_comment";
import { Task, TaskComment } from "@/src/types";
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
      onSuccess: (task) => {
        // const previousDatabaseTasks = queryClient.getQueryData([
        //   "database-tasks",
        //   databaseId,
        // ]) as Database & { tasks: Task[] };
        // queryClient.setQueryData<Database & { tasks: Task[] }>(
        //   ["database-tasks", databaseId],
        //   (old) => ({
        //     ...previousDatabaseTasks,
        //     views: previousDatabaseTasks.views.map((view) => {
        //       if (view.name === viewName) {
        //         return {
        //           ...view,
        //           config: {
        //             ...view.config,
        //             groups: view.config?.groups?.map((group) => {
        //               if (
        //                 group.group_by_value ===
        //                 task.properties[view.config?.group_by as string]
        //               ) {
        //                 return {
        //                   ...group,
        //                   task_order: group.task_order.filter(
        //                     (taskId) => taskId !== task.id,
        //                   ),
        //                 };
        //               } else {
        //                 return group;
        //               }
        //             }),
        //           },
        //         };
        //       } else {
        //         return view;
        //       }
        //     }),
        //     tasks: previousDatabaseTasks.tasks.filter((t) => t.id !== task.id),
        //   }),
        // );
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
        console.warn("calling add task");
        const addedTask = await addKanbanTask(task, viewId);
        console.warn("here");
        return addedTask;
      } catch (err) {
        console.warn(err);
        throw err;
      }
    },

    {
      onMutate: () => {
        console.warn("hi");
      },
      onSettled: () => {
        console.warn("settled");
        queryClient.invalidateQueries({ queryKey: ["databases", databaseId] });
      },
      onSuccess: (task) => {
        // const previousDatabaseTasks = queryClient.getQueryData([
        //   "database-tasks",
        //   databaseId,
        // ]) as Database & { tasks: Task[] };
        // console.warn("setting query data");
        // queryClient.setQueryData<Database & { tasks: Task[] }>(
        //   ["database-tasks", databaseId],
        //   (old) => ({
        //     ...previousDatabaseTasks,
        //     views: previousDatabaseTasks.views.map((view) => {
        //       if (view.name === viewName) {
        //         return {
        //           ...view,
        //           config: {
        //             ...view.config,
        //             groups: view.config?.groups?.map((group) => {
        //               if (
        //                 group.group_by_value ===
        //                 task.properties[view.config?.group_by as string]
        //               ) {
        //                 return {
        //                   ...group,
        //                   task_order: [...group.task_order, task.id as string],
        //                 };
        //               } else {
        //                 return group;
        //               }
        //             }),
        //           },
        //         };
        //       } else {
        //         return view;
        //       }
        //     }),
        //     tasks: [...previousDatabaseTasks?.tasks, task],
        //   }),
        // );
      },
    },
  );
};

// Update an existing task
export const useUpdateTask = (databaseId: string, viewId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<Task>;
    }) => updateTask(id, changes, viewId),
    // {
    //   onSuccess: (updatedTaskData, variables) => {
    //     // const previousDatabaseTasks = queryClient.getQueryData([
    //     //   "database-tasks",
    //     //   databaseId,
    //     // ]) as Database & { tasks: Task[] };
    //     // const newViews = previousDatabaseTasks.views.map((view) => {
    //     //   const changedProperties = updatedTaskData.updatedTask.properties;
    //     //   if (!changedProperties) return view;

    //     //   Object.keys(changedProperties).forEach((propertyName) => {
    //     //     if (view.config?.group_by === propertyName) {
    //     //       // Remove task from the old group
    //     //       let indexToRemove = -1;
    //     //       let groupToRemoveTaskFrom: GroupByGroup | null = null;
    //     //       view.config.groups?.forEach((group) => {
    //     //         const taskIndex = group.task_order.indexOf(updatedTaskData.id);
    //     //         if (taskIndex !== -1) {
    //     //           indexToRemove = taskIndex;
    //     //           groupToRemoveTaskFrom = group;
    //     //         }
    //     //       });

    //     //       if (indexToRemove !== -1 && groupToRemoveTaskFrom) {
    //     //         (groupToRemoveTaskFrom as GroupByGroup).task_order.splice(
    //     //           indexToRemove,
    //     //           1,
    //     //         );
    //     //       }

    //     //       // Add task to the new group
    //     //       const newGroupByValue = changedProperties[view.config.group_by];
    //     //       const newGroup = view.config.groups?.find(
    //     //         (group) => group.group_by_value === newGroupByValue,
    //     //       );

    //     //       if (newGroup) {
    //     //         newGroup.task_order.push(updatedTaskData.id);
    //     //       } else {
    //     //         // If the group does not exist, create it
    //     //         view.config.groups = [
    //     //           ...(view.config.groups || []),
    //     //           {
    //     //             group_by_value: newGroupByValue,
    //     //             task_order: [updatedTaskData.id],
    //     //           },
    //     //         ];
    //     //       }
    //     //     }
    //     //   });

    //     //   return view;
    //     // });

    //     // queryClient.setQueryData<Database & { tasks: Task[] }>(
    //     //   ["database-tasks", databaseId],
    //     //   (old) => ({
    //     //     ...previousDatabaseTasks,
    //     //     views: newViews,
    //     //     tasks:
    //     //       old?.tasks.map((task) => {
    //     //         if (task?.id === updatedTaskData.id) {
    //     //           return {
    //     //             id: updatedTaskData.id,
    //     //             database_id: updatedTaskData.updatedTask.database_id ?? "",
    //     //             description: updatedTaskData.updatedTask.description ?? "",
    //     //             properties: updatedTaskData.updatedTask.properties,
    //     //             title: updatedTaskData.updatedTask.title,
    //     //             created_at: updatedTaskData.updatedTask.created_at,
    //     //             updated_at: updatedTaskData.updatedTask.updated_at,
    //     //           } as Task;
    //     //         }
    //     //         return task;
    //     //       }) ?? [],
    //     //   }),
    //     // );
    //   },
    // },
  );
};
