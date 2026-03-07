import { useQuery } from '@tanstack/react-query';
import { apiBaseUrl } from '../constants';

export function useReports2(filters) {
  const { faction, patch, difficulty, mission, page, modifier } = filters;
  const patchId = patch.id;

  const queryKey = ['reports', faction, patchId, difficulty, mission, page, modifier];

  const queryFn = async () => {
    const res = await fetch(`${apiBaseUrl}/item_stats?faction=${faction}&patch_id=${patchId}&difficulty=${difficulty}&mission=${mission}&modifier=${modifier}&type=${page}`);
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