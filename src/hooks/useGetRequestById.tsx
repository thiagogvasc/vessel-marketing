import { useQuery } from 'react-query';
import { getRequestById } from '../utils/firestoreUtils';

const useGetRequestById = (id: string) => {
  return useQuery(['request', id], () => getRequestById(id), {
    enabled: !!id,
  });
};

export default useGetRequestById;
