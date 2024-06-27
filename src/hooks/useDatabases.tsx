import { useQuery } from "react-query";
import { getDatabases } from "../utils/firestoreUtils";





export const useGetDatabases = () => {
  return useQuery(["databases"], () =>  getDatabases(), {
    refetchOnMount: false
  });
};
