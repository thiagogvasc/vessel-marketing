import { supabase } from "@/supabaseClient";
import {
  AggregateColumn,
  DatabasePropertyDefinition,
  DatabaseView,
  Task,
} from "../types";
import { updateTask } from "./task";
import { getPropertyDefinitionsByDatabaseId } from "./database_property_definitions";

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

  config.groups = columns.map((column) => ({
    group_by_value: column.title,
    task_order: column.tasks.map((task) => task.id as string),
  }));
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
      groups: [
        ...(viewData.config?.groups ?? []),
        {
          group_by_value: newOption,
          task_order: [],
        },
      ],
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
        viewData.config?.groups?.filter(
          (group) => group.group_by_value !== optionToDelete,
        ) ?? [],
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
