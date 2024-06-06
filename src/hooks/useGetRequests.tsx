import { useQuery } from 'react-query';
import { getRequests } from '../utils/firestoreUtils';

const useGetRequests = () => {
  return useQuery('allRequests', getRequests);
};

export default useGetRequests;
