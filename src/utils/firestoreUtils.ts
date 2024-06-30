// src/utils/firestoreUtils.ts
import { collection, addDoc, getDocs, updateDoc, doc, DocumentData, QuerySnapshot, getDoc, where, query, Timestamp, writeBatch, serverTimestamp, documentId, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { User, Request, Task, Column, AggregateBoard, AggregateColumn, Database, GroupByGroup, PropertyType } from "../types";

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

export const getDatabases = async (): Promise<Database[]> => {
  const databasesSnapShot = await getDocs(collection(db, "databases"));
  return databasesSnapShot.docs.map((database) => ({
    id: database.id,
    ...database.data(),
  } as Database));
}

export const getDatabasesByClientId = async (clientId: string): Promise<Database[]> => {
  const q = query(collection(db, "databases"), where("client_id", "==", clientId));
  const databasesSnapShot = await getDocs(q);
  return databasesSnapShot.docs.map((database) => ({
    id: database.id,
    ...database.data(),
  } as Database));
}

export const addDatabase = async (databaseToAdd: Omit<Database, 'id'>): Promise<Database> => {
  const docRef = await addDoc(collection(db, "databases"), databaseToAdd);
  const createdDatabase: Database = { id: docRef.id, ...databaseToAdd };
  return createdDatabase;
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

interface NewTask extends Omit<Task, 'id' | 'created_at' | 'updated_at'> {}

export const addTask = async (newTask: NewTask, databaseId: string, viewName: string): Promise<Task> => {
  const tasksCollection = collection(db, 'tasks');
  const taskDoc = doc(tasksCollection)

  // Use a Firestore transaction to ensure atomicity
  const addedTask = await runTransaction(db, async (transaction) => {
    await setDoc(taskDoc, {
      ...newTask,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const databaseDoc = doc(db, 'databases', databaseId);
    const database = (await getDoc(databaseDoc)).data() as Database;
    const newviews = database.views.map(view => {
      if (view.name === viewName) {
        return {
          ...view,
          config: {
            ...view.config,
            groups: view.config?.groups?.map(group => {
              if (group.group_by_value === newTask.properties['status']) {
                return {
                  ...group,
                  task_order: [...group.task_order, taskDoc.id]
                }
              } else {
                return group;
              }
            })
          }
        }
      } else {
        return view;
      }
    })

    await updateDoc(databaseDoc, {
      views: newviews
    })


    const docSnap = await transaction.get(taskDoc);

    if (!docSnap.exists()) {
      throw new Error('Failed to get the document after adding it.');
    }

    const docData = docSnap.data() as Task;

    return {
      id: taskDoc.id,
      ...docData,
      created_at: docData.created_at,
      updated_at: docData.updated_at,
    };
  });

  console.warn('addedtask', addedTask)
  return addedTask;
};

export const deleteTask = async (taskToDelete: Task, databaseId: string, viewName: string): Promise<Task> => {
  const tasksCollection = collection(db, 'tasks');
  const taskDoc = doc(tasksCollection, taskToDelete.id);

  // Use a Firestore transaction to ensure atomicity
  const deletedTask = await runTransaction(db, async (transaction) => {
    const databaseDoc = doc(db, 'databases', databaseId);
    
    // Read the database document first
    const databaseSnap = await transaction.get(databaseDoc);
    if (!databaseSnap.exists()) {
      throw new Error('Database not found.');
    }

    const taskSnap = await transaction.get(taskDoc);
    if (!taskSnap.exists()) {
      throw new Error('Task not found.');
    }

    const database = databaseSnap.data() as Database;
    const newViews = database.views.map(view => {
      if (view.name === viewName) {
        return {
          ...view,
          config: {
            ...view.config,
            groups: view.config?.groups?.map(group => {
              if (group.group_by_value === taskToDelete.properties['status']) {
                return {
                  ...group,
                  task_order: group.task_order.filter(taskId => taskId !== taskToDelete.id)
                };
              } else {
                return group;
              }
            })
          }
        };
      } else {
        return view;
      }
    });

    // Update the database document within the transaction
    transaction.update(databaseDoc, { views: newViews });

    const taskData = taskSnap.data() as Task;

    // Delete the task document within the transaction
    transaction.delete(taskDoc);

    return {
      id: taskDoc.id,
      ...taskData,
      created_at: taskData.created_at,
      updated_at: taskData.updated_at,
    };
  });

  console.warn('deletedTask', deletedTask);
  return deletedTask;
};

export const updateTask = async (
  id: string,
  updatedTask: Partial<Omit<Task, "id">>,
  databaseId: string,
  viewName: string
): Promise<{id: string, updatedTask: Partial<Omit<Task, "id">>}> => {
  const taskDoc = doc(db, "tasks", id);
  await updateDoc(taskDoc, {
    ...updatedTask,
    updated_at: serverTimestamp(),
  });

  const database = await getDatabaseById(databaseId);
  if (!database) {
    throw new Error(`Database with id ${databaseId} not found`);
  }

  const newViews = database.views.map((view) => {
    const changedProperties = updatedTask.properties;
    if (!changedProperties) return view;

    Object.keys(changedProperties).forEach((propertyName) => {
      if (view.config?.group_by === propertyName) {
        // Remove task from the old group
        let indexToRemove = -1;
        let groupToRemoveTaskFrom: GroupByGroup | null = null;
        view.config.groups?.forEach((group) => {
          const taskIndex = group.task_order.indexOf(id);
          if (taskIndex !== -1) {
            indexToRemove = taskIndex;
            groupToRemoveTaskFrom = group;
          }
        });

        if (indexToRemove !== -1 && groupToRemoveTaskFrom) {
          (groupToRemoveTaskFrom as GroupByGroup).task_order.splice(indexToRemove, 1);
        }

        // Add task to the new group
        const newGroupByValue = changedProperties[view.config.group_by];
        const newGroup = view.config.groups?.find(
          (group) => group.group_by_value === newGroupByValue
        );

        if (newGroup) {
          newGroup.task_order.push(id);
        } else {
          // If the group does not exist, create it
          view.config.groups = [
            ...(view.config.groups || []),
            {
              group_by_value: newGroupByValue,
              task_order: [id],
            },
          ];
        }
      }
    });

    return view;
  });

  // Save the updated views back to the database
  const databaseDoc = doc(db, "databases", databaseId);
  await updateDoc(databaseDoc, {
    views: newViews,
  });

  return { id, updatedTask }
};

// Update the task order in a board
export const updateTaskOrder = async (boardId: string, columns: Column[]): Promise<void> => {
  const boardDoc = doc(db, 'boards', boardId);
  await updateDoc(boardDoc, {
    columns,
    updated_at: serverTimestamp(),
  });
};

export const updateKanbanViewManualSort = async (databaseId: string, viewName: string, columns: AggregateColumn[], taskId: string, updatedTask: Partial<Task>): Promise<{id: string, updatedTask: Partial<Task>, columns: AggregateColumn[]}> => {
  const databaseDoc = doc(db, 'databases', databaseId);
  const databaseSnapShot = await getDoc(databaseDoc);
  const database = databaseSnapShot.data() as Database;
  const view = database.views.find(view => view.name === viewName);

  view?.config?.groups && (view.config.groups = columns.map(column => ({ group_by_value: column.title, task_order: column.tasks.map(task => task.id as string)})));
  const updatedViews = database.views.map(v => (v.name === viewName ? view : v));
  await updateDoc(databaseDoc, {
    views: updatedViews,
  });

  await updateTask(taskId, updatedTask, databaseId, viewName);

  return {
    id: taskId,
    updatedTask,
    columns
  }
}

export const addKanbanColumn = async (databaseId: string, viewName: string, newOption: string) => {
  const databaseDoc = doc(db, 'databases', databaseId);
  
  try {
    // Fetch the current document data
    const docSnap = await getDoc(databaseDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Database;
      
      // Find the status property within propertyDefinitions
      const propertyDefinitions = data.propertyDefinitions || [];
      const statusProperty = propertyDefinitions.find((prop: any) => prop.name === 'status');

      const newViews = data.views.map(view => {
        if (view.name === viewName) {
          const newView = {...view};
          newView.config?.groups?.push({
            group_by_value: newOption,
            task_order: []
          })
          return newView;
        } else {
          return view;
        }
      });

      if (statusProperty && statusProperty.data && statusProperty.data.options) {
        // Add the new option to the options array if it doesn't already exist
        if (!statusProperty.data.options.includes(newOption)) {
          statusProperty.data.options.push(newOption);
          
          // Update the document with the modified propertyDefinitions array
          await updateDoc(databaseDoc, {
            propertyDefinitions: propertyDefinitions,
            views: newViews
          });

          return newOption;
        }
      }
    }
  } catch (error) {
    console.error('Error adding new option: ', error);
    throw error;
  }
};

export const deleteKanbanColumn = async (databaseId: string, viewName: string, optionToDelete: string) => {
  const databaseDoc = doc(db, 'databases', databaseId);
  
  try {
    // Fetch the current document data
    const docSnap = await getDoc(databaseDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Database;
      
      // Find the status property within propertyDefinitions
      const propertyDefinitions = data.propertyDefinitions || [];
      const statusProperty = propertyDefinitions.find((prop: any) => prop.name === 'status');

      const newViews = data.views.map(view => {
        if (view.name === viewName) {
          const newView = {...view};
          newView.config?.groups
          return {
            ...view,
            config: {
              ...view.config,
              groups: view.config?.groups?.filter(group => group.group_by_value !== optionToDelete)
            }
          };
        } else {
          return view;
        }
      });

      if (statusProperty && statusProperty.data && statusProperty.data.options) {
        // Add the new option to the options array if it doesn't already exist
        if (statusProperty.data.options.includes(optionToDelete)) {
          statusProperty.data.options = statusProperty.data.options.filter(prop => prop !== optionToDelete)
          
          // Update the document with the modified propertyDefinitions array
          await updateDoc(databaseDoc, {
            propertyDefinitions: propertyDefinitions,
            views: newViews
          });

          console.warn(newViews, propertyDefinitions)
          return optionToDelete;
        }
      }
    }
  } catch (error) {
    console.error('Error adding new option: ', error);
    throw error;
  }
}