import { supabase } from "../../supabaseClient"; // Adjust the path to your supabaseClient
import { Request, RequestUpdate } from "@/src/types";

export const createRequest = async (
  request: Omit<Request, "id">,
): Promise<string> => {
  const { data, error } = await supabase
    .from("request")
    .insert({
      ...request,
      created_at: new Date().toISOString(), // Supabase doesn't have serverTimestamp like Firebase, so use current time
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating request:", error.message);
    throw new Error(error.message);
  }

  return data.id;
};

export const getRequestById = async (
  id: string | undefined | null,
): Promise<Request | null> => {
  if (!id) return null;

  const { data, error } = await supabase
    .from("request")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching request:", error.message);
    return null;
  }

  return data as Request;
};

export const getRequests = async (): Promise<Request[]> => {
  const { data, error } = await supabase.from("request").select("*");

  if (error) {
    console.error("Error fetching requests:", error.message);
    throw new Error(error.message);
  }

  return data as Request[];
};

export const updateRequest = async (
  id: string,
  data: Partial<Request>,
): Promise<void> => {
  const { error } = await supabase
    .from("request")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating request:", error.message);
    throw new Error(error.message);
  }
};

export const addRequestUpdate = async (
  id: string,
  update: Omit<RequestUpdate, "id" | "updated_at">,
): Promise<void> => {
  const { data: currentRequest, error: fetchError } = await supabase
    .from("request")
    .select("updates")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching request for update:", fetchError.message);
    throw new Error(fetchError.message);
  }

  const updates = currentRequest?.updates ?? [];

  updates.push({ ...update, updated_at: new Date().toISOString() });

  const { error } = await supabase
    .from("request")
    .update({ updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error adding request update:", error.message);
    throw new Error(error.message);
  }
};
