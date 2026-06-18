import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useMyClub = () => {
  return useQuery({
    queryKey: ['myClub'],
    queryFn: async () => {
      const { data } = await api.get('/clubs/my');
      return data;
    },
    retry: false,
  });
};

export const useSquad = (clubId?: string) => {
  return useQuery({
    queryKey: ['squad', clubId],
    queryFn: async () => {
      const { data } = await api.get(`/clubs/${clubId}/squad`);
      return data;
    },
    enabled: !!clubId,
  });
};

export const usePlayer = (playerId?: string) => {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: async () => {
      const { data } = await api.get(`/players/${playerId}`);
      return data;
    },
    enabled: !!playerId,
  });
};
