import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTasks, addTask, updateTask, fetchBoard, updateTaskOrder, fetchAggregateBoard, getDatabaseTasks, getDatabaseById, addKanbanColumn } from '../utils/firestoreUtils';
import { Task, Column, AggregateColumn, AggregateBoard, Database } from '../types';
import { Updater } from 'react-query/types/core/utils';

// Fetch all tasks for a board
export const useGetDatabaseTasks = (databaseId: string | null | undefined) => {
  const queryClient = useQueryClient();

  return useQuery(['database-tasks', databaseId], () => {
    console.warn('start fetching database', databaseId)
    return databaseId ? getDatabaseTasks(databaseId) : Promise.resolve(null);;
  }, { enabled: !!databaseId, refetchOnMount: false });
};


export const useGetDatabaseById = (databaseId: string) => {
  return useQuery(["databases", databaseId], () => getDatabaseById(databaseId), {
    enabled: !!databaseId, // only run the query if id is truthy
  });
};


// Add a new task
// Add a new task
export const useAddTask = (databaseId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
      const addedTask = await addTask(task);
      return addedTask;
    },
    {
      onSuccess: (task) => {
        const previousDatabaseTasks = queryClient.getQueryData(['database-tasks', databaseId]) as Database & { tasks: Task[]};
        queryClient.setQueryData<Database & { tasks: Task[]}>(['database-tasks', databaseId], (old) => ({
          ...previousDatabaseTasks,
          tasks: [...old?.tasks ?? [], task]
        }))
      }
    }
  );
};

export const useReorderTask = () => {

};

export const useAddKanbanColumn = () => {
  return useMutation(
    async ({ databaseId, viewId, newOption }: { databaseId: string; viewId: string, newOption: string }) => {
      await addKanbanColumn(databaseId, viewId, newOption);
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