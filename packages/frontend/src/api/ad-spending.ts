import client from './client';

export interface AdSpending {
  id: string;
  date: string;
  amount: number;
  campaignName: string | null;
  description: string | null;
  platform: string;
}

export interface CreateAdSpendingData {
  date: string;
  amount: number;
  campaignName?: string;
  description?: string;
  platform?: string;
}

export const getAdSpending = (params?: { startDate?: string; endDate?: string }) =>
  client.get<AdSpending[]>('/ad-spending', { params }).then((r) => r.data);

export const createAdSpending = (data: CreateAdSpendingData) =>
  client.post<AdSpending>('/ad-spending', data).then((r) => r.data);

export const updateAdSpending = (id: string, data: Partial<CreateAdSpendingData>) =>
  client.patch<AdSpending>(`/ad-spending/${id}`, data).then((r) => r.data);

export const deleteAdSpending = (id: string) =>
  client.delete(`/ad-spending/${id}`).then((r) => r.data);
