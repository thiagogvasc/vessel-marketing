import { useEffect, useState } from "react";
import { AggregateColumn, Database, DatabaseView, Task } from "../types";

export const useKanbanColumns = (databaseWithTasks: Database & { tasks: Task[] } | null | undefined, databaseView: DatabaseView | null) => {
	const [columns, setColumns] = useState<AggregateColumn[]>([]);

	useEffect(() => {
		if (databaseWithTasks && databaseView) {
			const initialColumns: AggregateColumn[] = [];
			databaseView.config?.groups?.forEach(sortGroup => {
				const taskIds = sortGroup.task_order;
				const columnTitle = sortGroup.group_by_value;
				const tasks = taskIds.map(taskId =>
					databaseWithTasks.tasks.find(t => t.id === taskId) as Task
				);
				initialColumns.push({
					title: columnTitle,
					tasks,
				});
			});
			setColumns(initialColumns);
		}
	}, [databaseWithTasks, databaseView]);

	return { columns, setColumns };
};