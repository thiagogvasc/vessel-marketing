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
