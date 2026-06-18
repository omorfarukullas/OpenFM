import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useLeagueFixtures = (leagueId?: string) => {
  return useQuery({
    queryKey: ['fixtures', leagueId],
    queryFn: async () => {
      const { data } = await api.get(`/leagues/${leagueId}/fixtures`);
      return data;
    },
    enabled: !!leagueId,
  });
};

export const useSimulateMatchday = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leagueId: string) => {
      const { data } = await api.post(`/leagues/${leagueId}/simulate-matchday`);
      return data;
    },
    onSuccess: (_, leagueId) => {
      // Invalidate relevant queries to fetch fresh data automatically
      queryClient.invalidateQueries({ queryKey: ['fixtures', leagueId] });
      queryClient.invalidateQueries({ queryKey: ['league', leagueId] });
      queryClient.invalidateQueries({ queryKey: ['myClub'] });
    },
  });
};
