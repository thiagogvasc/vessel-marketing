import { useMutation, useQuery } from "react-query";
import { addDatabase, getDatabases } from "../utils/firestoreUtils";
import { Database } from "../types";





export const useGetDatabases = () => {
  return useQuery(["databases"], () =>  getDatabases(), {
    refetchOnMount: false
  });
};

export const useAddDatabase = () => {
  return useMutation(
    async (databaseToAdd: Omit<Database, 'id'>) => {
      try {
        const addedDatabase = await addDatabase(databaseToAdd);
        return addedDatabase;
      } catch (err) {
        console.warn(err)
        throw err
      }
    }, {
      onSuccess: (addedDatabase) => {
        // update query data
      }
    }
  )
}