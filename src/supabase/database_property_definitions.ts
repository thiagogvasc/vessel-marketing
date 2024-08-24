import { supabase } from "@/supabaseClient";
import { DatabasePropertyDefinition } from "../types";

export async function getPropertyDefinitionsByDatabaseId(databaseId: string) {
  try {
    // Fetch all tasks related to the database
    const { data: propertyDefinitions, error: tasksError } = await supabase
      .from("database_property_definition")
      .select("*")
      .eq("database_id", databaseId);

    if (tasksError) {
      throw new Error("Error fetching dataabse_proepty definitions");
    }

    console.warn(propertyDefinitions);
    return propertyDefinitions as DatabasePropertyDefinition[];
  } catch (error) {
    console.error("Error fetching  propertie defintions:", error);
    throw error;
  }
}
