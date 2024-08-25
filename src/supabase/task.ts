import { supabase } from "@/supabaseClient";
import { GroupByGroup, Task } from "../types";
import { getDatabaseViewById } from "./database_view";

export async function getTasksByDatabaseId(databaseId: string) {
  try {
    // Fetch all tasks related to the database
    const { data: tasks, error: tasksError } = await supabase
      .from("task")
      .select("*")
      .eq("database_id", databaseId);

    if (tasksError) {
      throw new Error("Error fetching tasks");
    }

    console.warn(tasks);
    return tasks as Task[];
  } catch (error) {
    console.error("Error fetching database and tasks:", error);
    throw error;
  }
}

export const addKanbanTask = async (
  newTask: Task,
  viewId: string,
): Promise<Task> => {
  const { data: taskData, error: taskError } = await supabase
    .from("task")
    .insert({
      ...newTask,
    })
    .select("*")
    .single();

  if (taskError) {
    throw new Error(`Failed to add task: ${taskError.message}`);
  }

  const viewData = await getDatabaseViewById(viewId);

  const newView = {
    ...viewData,
    config: {
      ...viewData.config,
      groups: viewData.config.groups.map((group: any) => {
        if (group.group_by_value === newTask.properties[viewData.config.group_by]) {
          return {
            ...group,
            task_order: [...group.task_order, taskData.id],
          };
        } else {
          return group;
        }
      }),
    },
  };

  const { error: updateError } = await supabase
    .from("database_view")
    .update(newView)
    .eq("id", viewId);

  if (updateError) {
    throw new Error(`Failed to update database views: ${updateError.message}`);
  }

  console.warn("addedTask", taskData);

  return {
    id: taskData.id,
    ...taskData,
  };
};

export const deleteKanbanTask = async (
  taskToDelete: Task,
  viewId: string,
): Promise<Task | null> => {
  // Fetch the database view by viewName and databaseId
  const { data: viewData, error: viewError } = await supabase
    .from("database_view")
    .select("*")
    .eq("id", viewId)
    .single();

  if (viewError) {
    throw new Error(`Failed to retrieve view: ${viewError.message}`);
  }

  const newConfig = {
    ...viewData.config,
    groups: viewData.config.groups.map((group: any) => {
      if (group.group_by_value === taskToDelete.properties["status"]) {
        return {
          ...group,
          task_order: group.task_order.filter(
            (taskId: string) => taskId !== taskToDelete.id,
          ),
        };
      } else {
        return group;
      }
    }),
  };

  // Update the views in the database
  const { error: updateError } = await supabase
    .from("database_view")
    .update({ config: newConfig })
    .eq("id", viewId);

  if (updateError) {
    throw new Error(`Failed to update database views: ${updateError.message}`);
  }

  // Delete the task from the 'task' table
  const { data: deletedTask, error: deleteError } = await supabase
    .from("task")
    .delete()
    .eq("id", taskToDelete.id)
    .select("*")
    .single();

  if (deleteError) {
    throw new Error(`Failed to delete task: ${deleteError.message}`);
  }

  console.warn("deletedTask", deletedTask);
  return deletedTask;
};

export const updateTask = async (
  id: string,
  updatedTask: Partial<Task>,
  viewId: string,
): Promise<{ id: string; updatedTask: Partial<Omit<Task, "id">> }> => {
  const { error: updateTaskError } = await supabase
    .from("task")
    .update(updatedTask)
    .eq("id", id);

  if (updateTaskError) {
    throw new Error(`Failed to update task: ${updateTaskError.message}`);
  }

  const { data: viewData, error: viewError } = await supabase
    .from("database_view")
    .select("*")
    .eq("id", viewId)
    .single();

  if (viewError) {
    throw new Error(`Failed to retrieve view: ${viewError.message}`);
  }

  // Update the views based on the changed task properties
  const getNewView = (view: any) => {
    const changedProperties = updatedTask.properties;
    if (!changedProperties) return view;

    Object.keys(changedProperties).forEach((propertyName) => {
      if (view.config?.group_by === propertyName) {
        // Remove task from the old group
        let indexToRemove = -1;
        let groupToRemoveTaskFrom: GroupByGroup | null = null;
        view.config.groups?.forEach((group: any) => {
          const taskIndex = group.task_order.indexOf(id);
          if (taskIndex !== -1) {
            indexToRemove = taskIndex;
            groupToRemoveTaskFrom = group;
          }
        });

        if (indexToRemove !== -1 && groupToRemoveTaskFrom) {
          (groupToRemoveTaskFrom as GroupByGroup).task_order.splice(
            indexToRemove,
            1,
          );
        }

        // Add task to the new group
        const newGroupByValue = changedProperties[view.config.group_by];
        const newGroup = view.config.groups?.find(
          (group: any) => group.group_by_value === newGroupByValue,
        );

        if (newGroup) {
          newGroup.task_order.push(id);
        } else {
          // If the group does not exist, create it
          view.config.groups = [
            ...(view.config.groups || []),
            {
              group_by_value: newGroupByValue,
              task_order: [id],
            },
          ];
        }
      }
    });

    return view;
  };

  const newView = getNewView({ ...viewData });

  // Update the views in the 'databases' table
  const { error: updateViewError } = await supabase
    .from("database_view")
    .update({ config: newView.config })
    .eq("id", viewId);

  if (updateViewError) {
    throw new Error(`Failed to update view: ${updateViewError.message}`);
  }

  return { id, updatedTask };
};
