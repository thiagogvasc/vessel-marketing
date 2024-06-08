// src/utils/firestoreUtils.ts
import { collection, addDoc, getDocs, updateDoc, doc, DocumentData, QuerySnapshot, getDoc, where, query, Timestamp, writeBatch } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { User, Request, Task, Column } from "../types";

export const convertDocs = <T>(querySnapshot: QuerySnapshot<DocumentData>): T[] => {
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as T));
};


// Fetch all tasks for a board
export const fetchTasks = async (taskIds: string[]): Promise<Task[]> => {
  const tasksCollection = collection(db, 'tasks');
  const tasks: Task[] = [];

  for (const taskId of taskIds) {
    const taskDoc = await getDoc(doc(tasksCollection, taskId));
    if (taskDoc.exists()) {
      tasks.push({ id: taskDoc.id, ...taskDoc.data() } as Task);
    }
  }

  return tasks;
};

// Fetch board data including columns and task order
export const fetchBoard = async (boardId: string): Promise<any> => {
  const boardDoc = await getDoc(doc(db, 'boards', boardId));
  if (boardDoc.exists()) {
    return { id: boardDoc.id, ...boardDoc.data() };
  } else {
    throw new Error('Board not found');
  }
};

// Add a new task
export const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  const tasksCollection = collection(db, 'tasks');
  const taskDoc = await addDoc(tasksCollection, {
    ...task,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  });
  return taskDoc.id;
};

// Update an existing task
export const updateTask = async (id: string, updatedTask: Partial<Omit<Task, 'id' | 'created_at'>>): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await updateDoc(taskDoc, {
    ...updatedTask,
    updated_at: Timestamp.now(),
  });
};

// Update the task order in a board
export const updateTaskOrder = async (boardId: string, columns: Column[]): Promise<void> => {
  const boardDoc = doc(db, 'boards', boardId);
  await updateDoc(boardDoc, {
    columns,
    updated_at: Timestamp.now(),
  });
};