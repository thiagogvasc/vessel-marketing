import { CreateDatabasePayload, Database } from "../types";
import { supabase } from "@/supabaseClient";

export const getDatabaseById = async (id: string): Promise<Database | null> => {
  const { data, error } = await supabase
    .from("database")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching database:", error);
    return null;
  }

  return data ? ({ id: data.id, ...data } as Database) : null;
};

export const getDatabases = async (): Promise<Database[]> => {
  const { data, error } = await supabase.from("database").select("*");

  if (error) {
    console.error("Error fetching databases:", error);
    return [];
  }

  return data.map((database) => ({ id: database.id, ...database }) as Database);
};

export const getDatabasesByClientId = async (
  clientId: string,
): Promise<Database[]> => {
  const { data, error } = await supabase
    .from("database")
    .select("*")
    .eq("client_id", clientId);

  if (error) {
    console.error("Error fetching databases by client ID:", error);
    return [];
  }

  return data.map((database) => ({ id: database.id, ...database }) as Database);
};

export const addDatabase = async (
  payload: CreateDatabasePayload,
): Promise<Database> => {
  const { propertyDefinitions, views, ...database } = payload;
  const { error } = await supabase
    .from("database")
    .insert([database])
    .select("*")
    .single();

  if (error) {
    console.error("Error adding database:", error);
    throw error;
  }

  const { error: propertyDefError } = await supabase
    .from("database_property_definition")
    .insert(propertyDefinitions);

  if (propertyDefError) {
    console.error("Error adding property definitions:", propertyDefError);
    throw propertyDefError;
  }

  const { error: viewError } = await supabase
    .from("database_view")
    .insert(views);

  if (viewError) {
    console.error("Error adding views:", viewError);
    throw viewError;
  }

  return database;
};


export const deleteDatabase = async (id: string): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("database")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(`Failed to delete database: ${deleteError.message}`);
  }
};
