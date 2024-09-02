import { supabase } from "../../supabaseClient"; // Adjust the path to your supabaseClient
import { Request, RequestStatusUpdate } from "@/src/types";

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

export const getRequestStatusUpdates = async (
  requestId: string,
): Promise<RequestStatusUpdate[]> => {
  const { data, error } = await supabase
    .from("request_status_update")
    .select("*")
    .eq("request_id", requestId);

  if (error) {
    console.error("Error fetching request updates:", error.message);
    return [];
  }

  return data as RequestStatusUpdate[];
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
  update: RequestStatusUpdate,
): Promise<void> => {
  const { data, error } = await supabase
    .from("request_status_update")
    .insert(update)
    .select("*")
    .single();

  if (error) {
    console.error("Error creating request status update:", error.message);
    throw new Error(error.message);
  }

  return data.id;
};
