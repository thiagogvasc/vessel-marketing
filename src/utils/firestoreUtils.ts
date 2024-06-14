// src/utils/firestoreUtils.ts
import { collection, addDoc, getDocs, updateDoc, doc, DocumentData, QuerySnapshot, getDoc, where, query, Timestamp, writeBatch, serverTimestamp, documentId } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { User, Request, Task, Column, AggregateBoard, AggregateColumn, Database } from "../types";

export const convertDocs = <T>(querySnapshot: QuerySnapshot<DocumentData>): T[] => {
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as T));
};


// Fetch all tasks for a board
export const fetchTasks = async (taskIds: string[]): Promise<Task[]> => {
  const tasksCollection = collection(db, 'tasks');
  
  // Create a query to fetch tasks with IDs in the taskIds array
  const q = query(tasksCollection, where(documentId(), 'in', taskIds));
  
  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);
  
  // Map the results to an array of Task objects
  const tasks: Task[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task));
  
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

export const getDatabaseById = async (id: string): Promise<Database | null> => {
  const docRef = doc(db, 'databases', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return { id: docSnap.id, ...docSnap.data() } as Database;
};

export async function getDatabaseTasks(databaseId: string) {
  try {
    // Fetch the database document
    const databaseDocRef = doc(db, 'databases', databaseId);
    console.warn('getting datbase')
    const databaseDocSnap = await getDoc(databaseDocRef);
    
    if (!databaseDocSnap.exists()) {
      throw new Error('Database not found');
    }
    
    // Fetch all tasks related to the database
    const tasksCollectionRef = collection(db, 'tasks');
    const tasksQuery = query(tasksCollectionRef, where('database_id', '==', databaseId));
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));


    // Combine database data with tasks
    const databaseData = databaseDocSnap.data() as Database;
    console.warn({
      id: databaseDocSnap.id,
      ...databaseData,
      tasks
    })
    return {
      id: databaseDocSnap.id,
      ...databaseData,
      tasks
    };
  } catch (error) {
    console.error('Error fetching database and tasks:', error);
    throw error;
  }
}

export const fetchAggregateBoard = async (boardId: string): Promise<any> => {
  // Fetch the board document
  const boardDoc = await getDoc(doc(db, 'boards', boardId));
  
  if (!boardDoc.exists()) {
    throw new Error('Board not found');
  }
  
  const boardData = boardDoc.data();
  const columns = boardData.columns || [];
  
  // Extract all task IDs from the columns
  const taskIds: string[] = columns.reduce((acc: string[], column: Column) => {
    return acc.concat(column.taskIds || []);
  }, []);

  // If no task IDs, return the board as is
  if (taskIds.length === 0) {
    return { id: boardDoc.id, ...boardData, columns };
  }

  // Perform a batched read for all tasks in a single query
  const tasksCollection = collection(db, 'tasks');
  const q = query(tasksCollection, where('__name__', 'in', taskIds));
  const querySnapshot = await getDocs(q);
  
  const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Map tasks to their corresponding columns
  const columnsWithTasks = columns.map((column: Column) => ({
    title: column.title,
    tasks: column.taskIds.map(columnTask => tasks.find(task => task.id === columnTask)),
  } as AggregateColumn));

  return { id: boardDoc.id, ...boardData, columns: columnsWithTasks } as AggregateBoard;
};



// Add a new task
export const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  const tasksCollection = collection(db, 'tasks');
  const taskDoc = await addDoc(tasksCollection, {
    ...task,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return taskDoc.id;
};

// Update an existing task
export const updateTask = async (id: string, updatedTask: Partial<Omit<Task, 'id' | 'created_at'>>): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await updateDoc(taskDoc, {
    ...updatedTask,
    updated_at: serverTimestamp(),
  });
};

// Update the task order in a board
export const updateTaskOrder = async (boardId: string, columns: Column[]): Promise<void> => {
  const boardDoc = doc(db, 'boards', boardId);
  await updateDoc(boardDoc, {
    columns,
    updated_at: serverTimestamp(),
  });
};