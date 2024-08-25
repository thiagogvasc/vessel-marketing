import { supabase } from "@/supabaseClient";
import { TaskComment } from "../types";

export const addTaskComment = async (
  comment: TaskComment,
): Promise<TaskComment> => {
  const { data: commentData, error: commentError } = await supabase
    .from("task_comment")
    .insert(comment)
    .select("*")
    .single();

  if (commentError) {
    throw new Error(`Failed to add task comment: ${commentError.message}`);
  }

  return commentData;
};

export const deleteTaskComment = async (commentId: string): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("task_comment")
    .delete()
    .eq("id", commentId);

  if (deleteError) {
    throw new Error(`Failed to delete task comment: ${deleteError.message}`);
  }
};

export const updateTaskComment = async (
  id: string,
  changes: Partial<TaskComment>,
): Promise<void> => {
  const { error: updateError } = await supabase
    .from("task_comment")
    .update(changes)
    .eq("id", id);

  if (updateError) {
    throw new Error(`Failed to update task comment: ${updateError.message}`);
  }
};

export async function getCommentsByTaskId(taskId: string) {
  try {
    // Fetch all tasks related to the database
    const { data: comments, error: commentsError } = await supabase
      .from("task_comment")
      .select("*")
      .eq("task_id", taskId);

    if (commentsError) {
      throw new Error("Error fetching comments");
    }

    console.warn(comments);
    return comments as TaskComment[];
  } catch (error) {
    console.error("Error fetching  comments:", error);
    throw error;
  }
}
