import { useQuery } from 'react-query';
import { getRequestsByClientId } from '../utils/firestoreUtils';

const useGetRequestsByClientId = (clientId: string) => {
  return useQuery(['requestsForClient', clientId], () => getRequestsByClientId(clientId), {
    enabled: !!clientId,
  });
};

export default useGetRequestsByClientId;