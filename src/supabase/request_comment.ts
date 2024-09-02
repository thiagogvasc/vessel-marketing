import { supabase } from "@/supabaseClient";
import { RequestComment } from "../types";

export const addRequestComment = async (
  comment: RequestComment,
): Promise<RequestComment> => {
  const { data: commentData, error: commentError } = await supabase
    .from("request_comment")
    .insert(comment)
    .select("*")
    .single();

  if (commentError) {
    throw new Error(`Failed to add request comment: ${commentError.message}`);
  }

  return commentData;
};

export const deleteRequestComment = async (
  commentId: string,
): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("request_comment")
    .delete()
    .eq("id", commentId);

  if (deleteError) {
    throw new Error(`Failed to delete request comment: ${deleteError.message}`);
  }
};

export const updateRequestComment = async (
  id: string,
  changes: Partial<RequestComment>,
): Promise<void> => {
  const { error: updateError } = await supabase
    .from("request_comment")
    .update(changes)
    .eq("id", id);

  if (updateError) {
    throw new Error(`Failed to update request comment: ${updateError.message}`);
  }
};

export async function getCommentsByRequestId(requestId: string) {
  try {
    // Fetch all requests related to the database
    const { data: comments, error: commentsError } = await supabase
      .from("request_comment")
      .select("*")
      .eq("request_id", requestId);

    if (commentsError) {
      throw new Error("Error fetching comments");
    }

    console.warn(comments);
    return comments as RequestComment[];
  } catch (error) {
    console.error("Error fetching  comments:", error);
    throw error;
  }
}
