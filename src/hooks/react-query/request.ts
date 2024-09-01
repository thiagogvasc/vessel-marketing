import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  createRequest,
  getRequestById,
  getRequests,
  updateRequest,
  addRequestUpdate,
  getRequestStatusUpdates,
} from "../../supabase/request";
import { Request, RequestStatusUpdate } from "../../types";

// Hook to get all requests
export const useGetRequests = () => {
  return useQuery("requests", getRequests);
};

// Hook to get a single request by ID
export const useGetRequestById = (id: string | undefined | null) => {
  return useQuery(
    ["requests", id],
    () => (id ? getRequestById(id) : Promise.resolve(null)),
    {
      enabled: !!id,
      staleTime: 60000, // only run the query if id is truthy
    },
  );
};

export const useGetRequestStatusUpdatesByRequestId = (requestId: string | undefined | null) => {
  return useQuery(
    ["requests", requestId, 'status-updates'],
    () => (requestId ? getRequestStatusUpdates(requestId) : Promise.resolve(null)),
    {
      enabled: !!requestId,
      staleTime: 60000, // only run the query if id is truthy
    },
  );
};

// Hook to create a new request
export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(createRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("requests");
    },
  });
};

// Hook to update a request
export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, updates }: { id: string; updates: Partial<Request> }) =>
      updateRequest(id, updates),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries("requests");
        queryClient.invalidateQueries(["requests", id]);
      },
    },
  );
};

// Hook to add an update to a request
export const useAddRequestUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      statusUpdate,
    }: {
      requestId: string;
      statusUpdate: RequestStatusUpdate;
    }) => addRequestUpdate(statusUpdate),
    {
      onSuccess: (_, { requestId }) => {
        queryClient.invalidateQueries(["request", requestId]);
        queryClient.invalidateQueries(["request", requestId, 'status-updates']);
      },
    },
  );
};
