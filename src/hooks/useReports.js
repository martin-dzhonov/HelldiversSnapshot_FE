import { useQuery } from '@tanstack/react-query';
import { apiBaseUrl } from '../constants';

export function useReports(filters) {
  const { difficulty, mission, page } = filters;

  const queryKey = ['reports', difficulty, mission, page];

  const queryFn = async () => {
    const res = await fetch(`${apiBaseUrl}/history_${page}?difficulty=${difficulty}&mission=${mission}`);
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