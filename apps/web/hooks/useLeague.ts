import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useLeagues = () => {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: async () => {
      const { data } = await api.get('/leagues');
      return data;
    },
  });
};

export const useLeague = (leagueId?: string) => {
  return useQuery({
    queryKey: ['league', leagueId],
    queryFn: async () => {
      const { data } = await api.get(`/leagues/${leagueId}`);
      return data;
    },
    enabled: !!leagueId,
  });
};
