import { useMutation, useQueryClient } from "react-query";
import { updateRequest } from "../supabase/request";
import { Request } from "../types";

const useUpdateRequest = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({id, changes }: {id: string, changes: Partial<Request>}) => updateRequest(id, changes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request", id]);
      },
    },
  );
};

export default useUpdateRequest;
