import { useQuery } from '@tanstack/react-query';
import { apiBaseUrl } from '../constants';

export function useItemDetails({id, filters}) {

  const { patch, page } = filters;

  const queryKey = [`${page}_${id}_${patch.id}`, id, patch.id];

  const queryFn = async () => {
    const res = await fetch(`${apiBaseUrl}/${page}?id=${id}&patch_id=${patch.id}`);
    if (!res.ok) throw new Error('Network response error');
    return res.json();
  };

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}