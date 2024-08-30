import { useEffect, useState } from "react";
import { Task, ViewTaskOrder } from "../types";

export const useOrderedTasks = (
  databaseTasks: Task[] | null | undefined,
  viewTaskOrders: ViewTaskOrder[] | null | undefined,
) => {
  const [orderedTasks, setOrderedTasks] = useState<Task[]>([]);
  useEffect(() => {
    if (databaseTasks && viewTaskOrders && viewTaskOrders.length > 0) {
      const taskMap = new Map<string, Task>();

      // Create a map of task_id to Task object for easy lookup
      databaseTasks.forEach((task) => {
        taskMap.set(task.id, task);
      });

      // Find the first task (which has prev_task_id as NULL)
      let firstTaskOrder = viewTaskOrders.find((vto) => !vto.prev_task_id);

      // If there is no first task, return an empty column
      if (!firstTaskOrder) {
        setOrderedTasks([]);
        return;
      }

      const orderedTasks: Task[] = [];
      let currentTaskOrder = firstTaskOrder;

      // Traverse the linked list of tasks
      while (currentTaskOrder) {
        const task = taskMap.get(currentTaskOrder.task_id);
        if (task) {
          orderedTasks.push(task);
        }
        currentTaskOrder = viewTaskOrders.find(
          (vto) => vto.task_id === currentTaskOrder.next_task_id,
        ) as ViewTaskOrder;
      }

      setOrderedTasks(orderedTasks);
    }
  }, [databaseTasks, viewTaskOrders]);

  return { orderedTasks };
};
