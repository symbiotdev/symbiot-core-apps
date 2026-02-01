import { useMutation } from '../hooks/use-mutation';
import axios from 'axios';

export const useCreateIssueReq = () =>
  useMutation<void, string, { message: string }>({
    showAlert: true,
    mutationFn: (data) => axios.post('/api/issue', data),
  });
