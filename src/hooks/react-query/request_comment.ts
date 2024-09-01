import {
    addRequestComment,
    deleteRequestComment,
    getCommentsByRequestId,
    updateRequestComment,
  } from "@/src/supabase/request_comment";
  import { Request, RequestComment } from "@/src/types";
  import { useMutation, useQuery, useQueryClient } from "react-query";
  
  export const useGetCommentsByRequestId = (
    requestId: string | undefined | null,
  ) => {
    return useQuery(
      ["requests", requestId, "comments"],
      () => (requestId ? getCommentsByRequestId(requestId) : Promise.resolve(null)),
      {
        enabled: !!requestId,
        staleTime: 60000,
      },
    );
  };
  
  export const useAddRequestComment = (
    requestId: string | undefined,
  ) => {
    const queryClient = useQueryClient();
    return useMutation((comment: RequestComment) => addRequestComment(comment), {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["requests", requestId, "comments"],
        });
      },
    });
  };
  
  export const useDeleteRequestComment = (
    requestId: string | undefined,
  ) => {
    const queryClient = useQueryClient();
    return useMutation((commentId: string) => deleteRequestComment(commentId), {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["requests", requestId, "comments"],
        });
      },
    });
  };
  
  export const useUpdateRequestComment = (
    requestId: string | undefined,
  ) => {
    const queryClient = useQueryClient();
  
    return useMutation(
      ({ id, changes }: { id: string; changes: Partial<RequestComment> }) =>
        updateRequestComment(id, changes),
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["requests", requestId, "comments"],
          });
        },
      },
    );
  };
  