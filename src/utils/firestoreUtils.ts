import {
  updateDoc,
  doc,
  DocumentData,
  QuerySnapshot,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Task,
  Column,
  AggregateColumn,
  Database,
} from "../types";

export const convertDocs = <T>(
  querySnapshot: QuerySnapshot<DocumentData>,
): T[] => {
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as T,
  );
};

export const updateKanbanViewManualSort = async (
  databaseId: string,
  viewName: string,
  columns: AggregateColumn[],
  taskId: string,
  updatedTask: Partial<Task>,
): Promise<{
  id: string;
  updatedTask: Partial<Task>;
  columns: AggregateColumn[];
}> => {
  const databaseDoc = doc(db, "databases", databaseId);
  const databaseSnapShot = await getDoc(databaseDoc);
  const database = databaseSnapShot.data() as Database;
  const view = database.views.find((view) => view.name === viewName);

  view?.config?.groups &&
    (view.config.groups = columns.map((column) => ({
      group_by_value: column.title,
      task_order: column.tasks.map((task) => task.id as string),
    })));
  const updatedViews = database.views.map((v) =>
    v.name === viewName ? view : v,
  );
  await updateDoc(databaseDoc, {
    views: updatedViews,
  });

  await updateTask(taskId, updatedTask, databaseId, viewName);

  return {
    id: taskId,
    updatedTask,
    columns,
  };
};

export const addKanbanColumn = async (
  databaseId: string,
  viewName: string,
  newOption: string,
) => {
  const databaseDoc = doc(db, "databases", databaseId);

  try {
    // Fetch the current document data
    const docSnap = await getDoc(databaseDoc);

    if (docSnap.exists()) {
      const data = docSnap.data() as Database;

      // Find the status property within propertyDefinitions
      const propertyDefinitions = data.propertyDefinitions || [];
      const statusProperty = propertyDefinitions.find(
        (prop: any) => prop.name === "status",
      );

      const newViews = data.views.map((view) => {
        if (view.name === viewName) {
          const newView = { ...view };
          newView.config?.groups?.push({
            group_by_value: newOption,
            task_order: [],
          });
          return newView;
        } else {
          return view;
        }
      });

      if (
        statusProperty &&
        statusProperty.data &&
        statusProperty.data.options
      ) {
        // Add the new option to the options array if it doesn't already exist
        if (!statusProperty.data.options.includes(newOption)) {
          statusProperty.data.options.push(newOption);

          // Update the document with the modified propertyDefinitions array
          await updateDoc(databaseDoc, {
            propertyDefinitions: propertyDefinitions,
            views: newViews,
          });

          return newOption;
        }
      }
    }
  } catch (error) {
    console.error("Error adding new option: ", error);
    throw error;
  }
};

export const deleteKanbanColumn = async (
  databaseId: string,
  viewName: string,
  optionToDelete: string,
) => {
  const databaseDoc = doc(db, "databases", databaseId);

  try {
    // Fetch the current document data
    const docSnap = await getDoc(databaseDoc);

    if (docSnap.exists()) {
      const data = docSnap.data() as Database;

      // Find the status property within propertyDefinitions
      const propertyDefinitions = data.propertyDefinitions || [];
      const statusProperty = propertyDefinitions.find(
        (prop: any) => prop.name === "status",
      );

      const newViews = data.views.map((view) => {
        if (view.name === viewName) {
          const newView = { ...view };
          newView.config?.groups;
          return {
            ...view,
            config: {
              ...view.config,
              groups: view.config?.groups?.filter(
                (group) => group.group_by_value !== optionToDelete,
              ),
            },
          };
        } else {
          return view;
        }
      });

      if (
        statusProperty &&
        statusProperty.data &&
        statusProperty.data.options
      ) {
        // Add the new option to the options array if it doesn't already exist
        if (statusProperty.data.options.includes(optionToDelete)) {
          statusProperty.data.options = statusProperty.data.options.filter(
            (prop) => prop !== optionToDelete,
          );

          // Update the document with the modified propertyDefinitions array
          await updateDoc(databaseDoc, {
            propertyDefinitions: propertyDefinitions,
            views: newViews,
          });

          console.warn(newViews, propertyDefinitions);
          return optionToDelete;
        }
      }
    }
  } catch (error) {
    console.error("Error adding new option: ", error);
    throw error;
  }
};
