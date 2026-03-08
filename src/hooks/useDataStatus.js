import { useQuery } from '@tanstack/react-query';
import { apiBaseUrl } from '../constants';

export function useDataStatus() {

  const queryKey = ['useDataStatus'];

  const queryFn = async () => {
    const res = await fetch(`${apiBaseUrl}/data_status`);
    if (!res.ok) throw new Error('Network response error');
    return res.json();
  };

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 20 * 60 * 1000,  // 20 min
    refetchOnWindowFocus: false,
  });
}