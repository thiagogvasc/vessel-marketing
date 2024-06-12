import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchTasks, addTask, updateTask, fetchBoard, updateTaskOrder, fetchAggregateBoard } from '../utils/firestoreUtils';
import { Task, Column, AggregateColumn, AggregateBoard } from '../types';

// Fetch all tasks for a board
export const useBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  return useQuery(['board', boardId], async () => {
    console.warn('start fetching board')
    const board = await fetchAggregateBoard(boardId) as AggregateBoard;
    // const aggregateColumns: AggregateColumn[] = [];

    // for (const column of board.columns) {
    //   const tasks = await fetchTasks(column.taskIds);
    //   aggregateColumns.push({
    //     title: column.title,
    //     tasks
    //   })
    // }

    return { board } ;
  });
};

// Add a new task
// Add a new task
export const useAddTask = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'> & { columnTitle: string }) => {
      const taskId = await addTask(task);
      const board = await fetchBoard(boardId);

      const column = board.columns.find((col: Column) => col.title === task.columnTitle);
      if (column) {
        column.taskIds.push(taskId);
      }

      await updateTaskOrder(boardId, board.columns);
      return { taskId, boardId, columnTitle: task.columnTitle };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['board', boardId]);
      },
    }
  );
};

// Update an existing task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, updatedTask }: { id: string; updatedTask: Partial<Omit<Task, 'id' | 'created_at'>> }) => updateTask(id, updatedTask),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['board', variables.updatedTask.board_id]);
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
