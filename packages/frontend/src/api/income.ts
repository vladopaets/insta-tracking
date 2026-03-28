import client from './client';

export interface Income {
  id: string;
  date: string;
  amount: number;
  clientName: string | null;
  description: string | null;
  source: string | null;
}

export interface CreateIncomeData {
  date: string;
  amount: number;
  clientName?: string;
  description?: string;
  source?: string;
}

export const getIncome = (params?: { startDate?: string; endDate?: string }) =>
  client.get<Income[]>('/income', { params }).then((r) => r.data);

export const createIncome = (data: CreateIncomeData) =>
  client.post<Income>('/income', data).then((r) => r.data);

export const updateIncome = (id: string, data: Partial<CreateIncomeData>) =>
  client.patch<Income>(`/income/${id}`, data).then((r) => r.data);

export const deleteIncome = (id: string) =>
  client.delete(`/income/${id}`).then((r) => r.data);
