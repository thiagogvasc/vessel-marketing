import { supabase } from "@/supabaseClient";
import { Task } from "../types";

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
  afterTaskId: string | null,
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

  const { data, error } = await supabase.rpc("add_task_to_view", {
    view_uuid: viewId, // UUID of the view where the task should be added
    new_task_uuid: newTask.id, // UUID of the new task to be added
    after_task_uuid: afterTaskId, // UUID of the task after which the new task should be inserted
  });

  if (error) {
    console.error("Error adding task to view:", error);
  } else {
    console.log("Task added to view:", data);
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

  return { id, updatedTask };
};
