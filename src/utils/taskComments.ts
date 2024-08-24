import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { TaskComment } from "../types";
import { db } from "@/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const addTaskComment = async (taskId: string, comment: TaskComment) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    comments: arrayUnion(comment),
  });

  return comment;
};
