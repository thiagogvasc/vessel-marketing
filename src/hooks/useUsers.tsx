import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTasks, addTask, updateTask, fetchBoard, updateTaskOrder } from '../utils/firestoreUtils';
import { Task, Column, AggregateColumn, User } from '../types';
import { getAllUsers, getUserById } from '../utils/users/userUtils';
import { useAuth } from '../contexts/AuthContext';


export const useGetAllUsers = () => {
  return useQuery("users", getAllUsers);
};

export const useGetCurrentUser = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery(['userById', userId], () => getUserById(userId), { enabled: !!userId, refetchOnMount: false }); 
}

export const useGetUserById = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery(['userById', userId], () => {
    return getUserById(userId).then(res => {
      return res
    }).catch(err => Promise.reject(err))
  }, { enabled: !!userId, refetchOnMount: false });
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
