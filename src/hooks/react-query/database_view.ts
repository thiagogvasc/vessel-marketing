export const useDeleteKanbanTask = (databaseId: string, viewName: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (taskToDelete: Task) => {
      try {
        console.warn("calling delete task");
        const deletedTask = await deleteTask(
          taskToDelete,
          databaseId,
          viewName,
        );
        return deletedTask;
      } catch (err) {
        console.warn(err);
        throw err;
      }
    },

    {
      onSuccess: (task) => {
        const previousDatabaseTasks = queryClient.getQueryData([
          "database-tasks",
          databaseId,
        ]) as Database & { tasks: Task[] };
        queryClient.setQueryData<Database & { tasks: Task[] }>(
          ["database-tasks", databaseId],
          (old) => ({
            ...previousDatabaseTasks,
            views: previousDatabaseTasks.views.map((view) => {
              if (view.name === viewName) {
                return {
                  ...view,
                  config: {
                    ...view.config,
                    groups: view.config?.groups?.map((group) => {
                      if (
                        group.group_by_value ===
                        task.properties[view.config?.group_by as string]
                      ) {
                        return {
                          ...group,
                          task_order: group.task_order.filter(
                            (taskId) => taskId !== task.id,
                          ),
                        };
                      } else {
                        return group;
                      }
                    }),
                  },
                };
              } else {
                return view;
              }
            }),
            tasks: previousDatabaseTasks.tasks.filter((t) => t.id !== task.id),
          }),
        );
      },
    },
  );
};

// Add a new task
export const useAddKanbanTask = (databaseId: string, viewName: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
      try {
        console.warn("calling add task");
        const addedTask = await addTask(task, databaseId, viewName);
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
      },
      onSuccess: (task) => {
        const previousDatabaseTasks = queryClient.getQueryData([
          "database-tasks",
          databaseId,
        ]) as Database & { tasks: Task[] };
        console.warn("setting query data");
        queryClient.setQueryData<Database & { tasks: Task[] }>(
          ["database-tasks", databaseId],
          (old) => ({
            ...previousDatabaseTasks,
            views: previousDatabaseTasks.views.map((view) => {
              if (view.name === viewName) {
                return {
                  ...view,
                  config: {
                    ...view.config,
                    groups: view.config?.groups?.map((group) => {
                      if (
                        group.group_by_value ===
                        task.properties[view.config?.group_by as string]
                      ) {
                        return {
                          ...group,
                          task_order: [...group.task_order, task.id as string],
                        };
                      } else {
                        return group;
                      }
                    }),
                  },
                };
              } else {
                return view;
              }
            }),
            tasks: [...previousDatabaseTasks?.tasks, task],
          }),
        );
      },
    },
  );
};
