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


export const addPropertyDefinition = async (
  propertyDefinition: DatabasePropertyDefinition,
): Promise<DatabasePropertyDefinition> => {
  const { data: propertyDefinitionData, error: propertyDefinitionError } = await supabase
    .from("database_property_definition")
    .insert(propertyDefinition)
    .select("*")
    .single();

  if (propertyDefinitionError) {
    throw new Error(`Failed to add property definition: ${propertyDefinitionError.message}`);
  }

  return propertyDefinitionData;
};

export const deletePropertyDefinition = async (id: string): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("database_property_definition")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(`Failed to delete database property definition: ${deleteError.message}`);
  }
};


export const updatePropertyDefinition = async (
  id: string,
  changes: Partial<DatabasePropertyDefinition>,
): Promise<void> => {
  const { error: updateError } = await supabase
    .from("database_property_definition")
    .update(changes)
    .eq("id", id);

  if (updateError) {
    throw new Error(`Failed to update database property definition: ${updateError.message}`);
  }
};