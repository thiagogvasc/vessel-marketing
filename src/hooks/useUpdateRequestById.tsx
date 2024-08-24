import { useMutation, useQueryClient } from "react-query";
import { updateRequest } from "../supabase/request";
import { Request } from "../types";

const useUpdateRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (updatedRequest: Request) => updateRequest(id, updatedRequest),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request", id]);
      },
    },
  );
};

export default useUpdateRequest;
