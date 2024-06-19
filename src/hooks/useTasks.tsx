import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTasks, addTask, updateTask, fetchBoard, updateTaskOrder, fetchAggregateBoard, getDatabaseTasks, getDatabaseById, addKanbanColumn, updateKanbanViewManualSort } from '../utils/firestoreUtils';
import { Task, Column, AggregateColumn, AggregateBoard, Database, PropertyType } from '../types';
import { Updater } from 'react-query/types/core/utils';

// Fetch all tasks for a board
export const useGetDatabaseTasks = (databaseId: string | null | undefined) => {
  // const queryClient = useQueryClient();

  return useQuery(['database-tasks', databaseId], () => {
    console.warn('start fetching database', databaseId)
    return databaseId ? getDatabaseTasks(databaseId) : Promise.resolve(null);;
  }, { enabled: !!databaseId, refetchOnMount: false });
};


export const useGetDatabaseById = (databaseId: string | undefined | null) => {
  return useQuery(["databases", databaseId], () => databaseId ? getDatabaseById(databaseId) : Promise.resolve(null), {
    enabled: !!databaseId, // only run the query if id is truthy
    refetchOnMount: false
  });
};


// Add a new task
// Add a new task
export const useAddTask = (databaseId: string, viewName: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        console.warn('calling add task')
        const addedTask = await addTask(task, databaseId, viewName);
        console.warn('here')
        return addedTask;
      } catch (err) {
        console.warn(err)
        throw err
      }
    },

    {
      onMutate: () => {
        console.warn('hi')
      },
      onSettled: () => {
        console.warn('settled')
      },
      onSuccess: (task) => {
        const previousDatabaseTasks = queryClient.getQueryData(['database-tasks', databaseId]) as Database & { tasks: Task[]};
        console.warn('setting query data')
        queryClient.setQueryData<Database & { tasks: Task[]}>(['database-tasks', databaseId], (old) => ({
          ...previousDatabaseTasks,
          views: previousDatabaseTasks.views.map((view) => {
            if (view.name === viewName) {
              return {
                ...view,
                config: {
                  ...view.config,
                  groups: view.config?.groups?.map(group => {
                    if (group.group_by_value === task.properties[view.config?.group_by as string]) {
                      return {
                        ...group,
                        task_order: [...group.task_order, task.id as string]
                      }
                    } else {
                      return group;
                    }
                  })
                }
              }
            } else {
              return view;
            }
          }),
          tasks: [...previousDatabaseTasks?.tasks, task]
        }))
      }
    }
  );
};

export const useUpdateKanbanViewManualSort = () => {
  return useMutation(
    async ({ databaseId, viewId, columns }: { databaseId: string; viewId: string, columns: AggregateColumn[] }) => {
      await updateKanbanViewManualSort(databaseId, viewId, columns);
    }
  );
}

export const useAddKanbanColumn = (databaseId: string, viewName: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ newOption }: { databaseId: string; viewName: string, newOption: string }) => {
      const newColumn = await addKanbanColumn(databaseId, viewName, newOption);
      return newColumn as string;
    },
    {
      onSuccess: (task) => {
        const previousDatabaseTasks = queryClient.getQueryData(['database-tasks', databaseId]) as Database & { tasks: Task[]};
        console.warn('setting query data')
        queryClient.setQueryData<Database & { tasks: Task[]}>(['database-tasks', databaseId], (old) => ({
          ...previousDatabaseTasks,
          views: previousDatabaseTasks.views.map((view) => {
            if (view.name === viewName) {
              return {
                ...view,
                config: {
                  ...view.config,
                  groups: [...view.config?.groups ?? [], { group_by_value: task, task_order: []}]
                }
              }
            } else {
              return view;
            }
          })
        }))
      }
    }
  );
};

export const useReorderColumn = () => {

};

// Update an existing task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, updatedTask }: { id: string; updatedTask: Partial<Omit<Task, 'id' | 'created_at'>> }) => updateTask(id, updatedTask),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['board', variables.updatedTask.database_id]);
      },
    }
  );
};