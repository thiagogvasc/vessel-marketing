import { supabase } from "@/supabaseClient";
import { DatabaseView } from "../types";

export async function getViewsByDatabaseId(databaseId: string) {
  try {
    // Fetch all tasks related to the database
    const { data: views, error: tasksError } = await supabase
      .from("database_view")
      .select("*")
      .eq("database_id", databaseId);

    if (tasksError) {
      throw new Error("Error fetching views");
    }

    console.warn(views);
    return views as DatabaseView[];
  } catch (error) {
    console.error("Error fetching  views:", error);
    throw error;
  }
}

export async function getDatabaseViewById(viewId: string) {
    try {
      const { data: databaseView, error: databaseViewError } = await supabase
        .from("database_view")
        .select("*")
        .eq("id", viewId)
        .single();
  
      if (databaseViewError) {
        throw new Error("Error fetching views");
      }
  
      console.warn(databaseView);
      return databaseView;
    } catch (error) {
      console.error("Error fetching  views:", error);
      throw error;
    }
  }
