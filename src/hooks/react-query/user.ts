import { useQuery } from "react-query";
import { getAllUsers, getUserById } from "../../supabase/user";
import { useAuth } from "../../contexts/AuthContext";

export const useGetAllUsers = () => {
  return useQuery("users", getAllUsers);
};

export const useGetCurrentUser = () => {
  const { user } = useAuth();
  return useGetUserById(user?.id);
};

export const useGetUserById = (userId: string | undefined) => {
  return useQuery(
    ["user", userId],
    () => {
      return getUserById(userId)
        .then((res) => {
          return res;
        })
        .catch((err) => Promise.reject(err));
    },
    { enabled: !!userId, refetchOnMount: false },
  );
};
