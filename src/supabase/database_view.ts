import { supabase } from "@/supabaseClient";
import {
  AggregateColumn,
  DatabasePropertyDefinition,
  DatabaseView,
  Task,
  ViewTaskOrder,
} from "../types";
import { getPropertyDefinitionsByDatabaseId } from "./database_property_definitions";

export const addDatabaseView = async (databaseView: DatabaseView) => {
  const { data: viewData, error: viewError } = await supabase
    .from("database_view")
    .insert(databaseView)
    .select("*")
    .single();

  if (viewError) {
    throw new Error(`Failed to add database view: ${viewError.message}`);
  }

  return viewData;
};

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
    return databaseView as DatabaseView;
  } catch (error) {
    console.error("Error fetching  views:", error);
    throw error;
  }
}

export const getViewTaskOrdersByViewId = async (
  viewId: string,
): Promise<ViewTaskOrder[]> => {
  const { data, error } = await supabase
    .from("view_task_order")
    .select("*")
    .eq("view_id", viewId); // Replace `viewId` with your actual view_id value

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Fetched data:", data);
  }
  return (data as ViewTaskOrder[]) ?? [];
};

export const deleteDatabaseView = async (id: string): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("database_view")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(`Failed to delete database view: ${deleteError.message}`);
  }
};

export const updateDatabaseView = async (
  id: string,
  changes: Partial<DatabaseView>,
): Promise<void> => {
  const { error: updateError } = await supabase
    .from("database_view")
    .update(changes)
    .eq("id", id);

  if (updateError) {
    throw new Error(`Failed to update database view: ${updateError.message}`);
  }
};

export const updateKanbanViewManualSort = async (
  viewId: string,
  columns: AggregateColumn[],
  taskId: string,
  taskChanges: Partial<Task>,
) => {
  const viewData = (await getDatabaseViewById(viewId)) as DatabaseView;
  const config = { ...viewData.config };

  config.groups = columns.map((column) => column.title);
  console.warn("updated config", config);
  const { error: updateError } = await supabase
    .from("database_view")
    .update({ config })
    .eq("id", viewId);

  if (updateError) {
    throw new Error(
      `Failed to update database view config: ${updateError.message}`,
    );
  }

  const { error: updateTaskError } = await supabase
    .from("task")
    .update(taskChanges)
    .eq("id", taskId);

  if (updateTaskError) {
    throw new Error(`Failed to update task: ${updateTaskError.message}`);
  }
};

export const addKanbanColumn = async (
  databaseId: string,
  viewId: string,
  newOption: string,
) => {
  try {
    const propertyDefinitions = (await getPropertyDefinitionsByDatabaseId(
      databaseId,
    )) as DatabasePropertyDefinition[];
    const viewData = (await getDatabaseViewById(viewId)) as DatabaseView;

    const newConfig = {
      ...viewData.config,
      groups: [...(viewData.config?.groups ?? []), newOption],
    };

    await updateDatabaseView(viewId, { config: newConfig });

    const groupByProperty = propertyDefinitions.find(
      (prop) => prop.id === viewData.config?.group_by,
    );

    if (
      groupByProperty &&
      groupByProperty.data &&
      groupByProperty.data.options
    ) {
      // Add the new option to the options array if it doesn't already exist
      if (!groupByProperty.data.options.includes(newOption)) {
        groupByProperty.data.options.push(newOption);

        // Update the document with the modified propertyDefinitions and views array
        const { error: updateError } = await supabase
          .from("database_property_definition")
          .update(groupByProperty)
          .eq("id", groupByProperty.id);

        if (updateError) throw updateError;

        return newOption;
      }
    }
  } catch (error) {
    console.error("Error adding new option: ", error);
    throw error;
  }
};

export const deleteKanbanColumn = async (
  databaseId: string,
  viewId: string,
  optionToDelete: string,
) => {
  try {
    const propertyDefinitions = (await getPropertyDefinitionsByDatabaseId(
      databaseId,
    )) as DatabasePropertyDefinition[];
    const viewData = (await getDatabaseViewById(viewId)) as DatabaseView;

    // Update the view config by removing the specified group
    const newConfig = {
      ...viewData.config,
      groups:
        viewData.config?.groups?.filter((group) => group !== optionToDelete) ??
        [],
    };

    await updateDatabaseView(viewId, { config: newConfig });

    const groupByProperty = propertyDefinitions.find(
      (prop) => prop.id === viewData.config?.group_by,
    );

    if (
      groupByProperty &&
      groupByProperty.data &&
      groupByProperty.data.options
    ) {
      // Remove the option from the options array if it exists
      if (groupByProperty.data.options.includes(optionToDelete)) {
        groupByProperty.data.options = groupByProperty.data.options.filter(
          (option: string) => option !== optionToDelete,
        );

        // Update the property definitions in the database
        const { error: updateError } = await supabase
          .from("database_property_definition")
          .update(groupByProperty)
          .eq("id", groupByProperty.id);

        if (updateError) throw updateError;

        return optionToDelete;
      }
    }
  } catch (error) {
    console.error("Error deleting option: ", error);
    throw error;
  }
};
