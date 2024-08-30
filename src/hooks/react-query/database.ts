import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addDatabase,
  deleteDatabase,
  getDatabaseById,
  getDatabases,
  getDatabasesByClientId,
} from "../../supabase/database";
import { CreateDatabasePayload, Database } from "@/src/types";
import { getTasksByDatabaseId } from "@/src/supabase/task";
import { getViewsByDatabaseId } from "@/src/supabase/database_view";

export const useGetDatabases = () => {
  return useQuery(["databases", "list"], () => getDatabases(), {
    staleTime: 60000,
  });
};

export const useGetDatabasesByClientId = (
  client_id: string | null | undefined,
) => {
  return useQuery(
    ["databases", "list", { client_id }],
    () =>
      client_id ? getDatabasesByClientId(client_id) : Promise.resolve(null),
    {
      staleTime: 60000,
    },
  );
};

export const useGetDatabaseTasks = (databaseId: string | null | undefined) => {
  return useQuery(
    ["databases", databaseId, "tasks"],
    () => {
      console.warn("start fetching tasks fro databse", databaseId);
      return databaseId
        ? getTasksByDatabaseId(databaseId)
        : Promise.resolve(null);
    },
    { enabled: !!databaseId, staleTime: 60000 },
  );
};

export const useGetDatabaseViews = (databaseId: string | null | undefined) => {
  const queryClient = useQueryClient();

  return useQuery(
    ["databases", databaseId, "views"],
    () => {
      console.warn("Start fetching views for database", databaseId);
      return databaseId
        ? getViewsByDatabaseId(databaseId)
        : Promise.resolve(null);
    },
    {
      enabled: !!databaseId,
      staleTime: 60000,
      onSuccess: (data) => {
        if (data) {
          data.forEach((view) => {
            // Assuming each view has an id, set the individual view data in the cache
            queryClient.setQueryData(["databases", databaseId, "views", view.id], view);
          });
        }
      },
    }
  );
};

export const useGetDatabaseById = (databaseId: string | undefined | null) => {
  return useQuery(
    ["databases", databaseId],
    () => (databaseId ? getDatabaseById(databaseId) : Promise.resolve(null)),
    {
      enabled: !!databaseId, // only run the query if id is truthy
      staleTime: 60000,
    },
  );
};

export const useAddDatabase = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (createDatabasePayload: CreateDatabasePayload) => {
      try {
        console.warn({ createDatabasePayload });
        const addedDatabase = await addDatabase(createDatabasePayload);
        console.warn("added database", addedDatabase);
        return addedDatabase;
      } catch (err) {
        console.warn(err);
        throw err;
      }
    },
    {
      onSettled: (_, variables) => {
        queryClient.refetchQueries(["databases"]);
      },
    },
  );
};

export const useDeleteDatabase = () => {
  const queryClient = useQueryClient();
  return useMutation(async (id: string) => deleteDatabase(id), {
    onSettled: (_, variables) => {
      queryClient.refetchQueries(["databases"]);
    },
  });
};
