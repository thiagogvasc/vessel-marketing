import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTasks, addTask, updateTask, fetchBoard, updateTaskOrder } from '../utils/firestoreUtils';
import { Task, Column, AggregateColumn, User } from '../types';
import { getUserById } from '../utils/users/userUtils';
import { useAuth } from '../contexts/AuthContext';


export const useGetCurrentUser = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery(['user', userId], () => userId ? getUserById(userId) : Promise.resolve(null)); 
}

export const useGetUserById = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery(['userById', userId], () => {
    return getUserById(userId).then(res => {
      return res
    }).catch(err => Promise.reject(err))
  });
};


// Update an existing task
export const useUpdateUserById = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, updatedUser }: { id: string; updatedUser: Partial<Omit<User, 'id' | 'created_at'>> }) => updateTask(id, updatedUser),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['user', variables.id]);
      },
    }
  );
};

// Update the task order
export const useUpdateTaskOrder = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (columns: Column[]) => updateTaskOrder(boardId, columns),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['board', boardId]);
      },
    }
  );
};
