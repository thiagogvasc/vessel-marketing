import { useMutation, useQueryClient } from "react-query";
import { Database, Task, TaskComment } from "../types";
import { addTaskComment } from "../utils/taskComments";


export const useAddTaskComment = (databaseId: string) => {
	const queryClient = useQueryClient();

	return useMutation(({ taskId, comment }: { taskId: string; comment: TaskComment }) => 
		addTaskComment(taskId, comment), {
			onMutate: ({ comment }) => {
				const previousDatabaseWithTasks = queryClient.getQueryData<Database & { tasks: Task[]}>(['database-tasks', databaseId])
				previousDatabaseWithTasks && queryClient.setQueryData<Database & { tasks: Task[]}>(['database-tasks', databaseId], () => ({
					...previousDatabaseWithTasks,
					tasks: previousDatabaseWithTasks?.tasks.map(task => ({
						...task,
						comments: [...task.comments, comment]
					}))
				}));
			},

			onSettled: () => {
				queryClient.invalidateQueries(['database-tasks', databaseId]);
			}
	});
};