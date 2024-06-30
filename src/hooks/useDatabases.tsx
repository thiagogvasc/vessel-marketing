import { useMutation, useQuery, useQueryClient } from "react-query";
import { addDatabase, getDatabases, getDatabasesByClientId } from "../utils/firestoreUtils";
import { Database } from "../types";





export const useGetDatabases = () => {
  return useQuery(["databases"], () => getDatabases(), {
    refetchOnMount: false
  });
};

export const useGetDatabasesByClientId = (client_id: string | null | undefined) => {
  return useQuery(["databasesByClientId"], () => client_id ? getDatabasesByClientId(client_id) : Promise.resolve(null), {
    refetchOnMount: false
  });
};


export const useAddDatabase = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (databaseToAdd: Omit<Database, 'id'>) => {
      try {
        const addedDatabase = await addDatabase(databaseToAdd);
        console.warn('added database', addedDatabase)
        return addedDatabase;
      } catch (err) {
        console.warn(err)
        throw err
      }
    }, {
      onSettled: (_, variables) => {
        queryClient.refetchQueries(['databases']);
      },
    }
  )
}