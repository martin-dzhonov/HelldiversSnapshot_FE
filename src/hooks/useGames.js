import { useQuery } from '@tanstack/react-query';
import { apiBaseUrl } from '../constants';

export function useGames(filters) {
  const { faction, patch, difficulty, mission} = filters;
  const queryKey = ['games', faction, patch, difficulty, mission];

  const queryFn = async () => {
    const res = await fetch(`${apiBaseUrl}/games?faction=${faction}&patch=${patch.id}&difficulty=${difficulty}&mission=${mission}`);
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