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
    staleTime: 20 * 60 * 1000, // 20 min
    refetchOnWindowFocus: false,
  });
}