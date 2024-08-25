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
import { getPropertyDefinitionsByDatabaseId } from "@/src/supabase/database_property_definitions";

export const useGetDatabases = () => {
  return useQuery(["databases", "list"], () => getDatabases(), {
    refetchOnMount: false,
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
      refetchOnMount: false,
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
    { enabled: !!databaseId, refetchOnMount: false },
  );
};

export const useGetDatabaseViews = (databaseId: string | null | undefined) => {
  return useQuery(
    ["databases", databaseId, "views"],
    () => {
      console.warn("start fetching  ivews for database", databaseId);
      return databaseId
        ? getViewsByDatabaseId(databaseId)
        : Promise.resolve(null);
    },
    { enabled: !!databaseId, refetchOnMount: false },
  );
};

export const useGetDatabaseById = (databaseId: string | undefined | null) => {
  return useQuery(
    ["databases", databaseId],
    () => (databaseId ? getDatabaseById(databaseId) : Promise.resolve(null)),
    {
      enabled: !!databaseId, // only run the query if id is truthy
      refetchOnMount: false,
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
  return useMutation(
    async (id: string) => deleteDatabase(id),
    {
      onSettled: (_, variables) => {
        queryClient.refetchQueries(["databases"]);
      },
    },
  );
};
