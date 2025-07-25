import { useQuery } from '@tanstack/react-query';
import { Gender } from '../types/gender';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';

export const useGenderQuery = () =>
  useQuery<Gender[], string>({
    queryKey: ['gender'],
    queryFn: () => requestWithStringError(axios.get('/api/gender')),
  });
