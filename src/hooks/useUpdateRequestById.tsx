import { useMutation, useQueryClient } from 'react-query';
import { updateRequestById } from '../utils/firestoreUtils';
import { Request } from '../types';

const useUpdateRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation((updatedRequest: Request) => updateRequestById(id, updatedRequest), {
    onSuccess: () => {
      queryClient.invalidateQueries(['request', id]);
    },
  });
};

export default useUpdateRequest;
