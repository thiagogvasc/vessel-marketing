import { useMutation, useQueryClient } from 'react-query';
import { addRequest } from '../utils/firestoreUtils';

const useAddRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(addRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('requests');
    },
  });
};

export default useAddRequest;
