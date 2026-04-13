import type {
  CreateExpenseRequest,
  ExpenseResponse,
  UpdateExpenseRequest,
} from '../../types/expenses'
import { apiClient } from './axios'

export const listExpenses = async (groupId: string): Promise<ExpenseResponse[]> => {
  const { data } = await apiClient.get<ExpenseResponse[]>(`/groups/${groupId}/expenses`)
  return data
}

export const createExpense = async (payload: CreateExpenseRequest): Promise<ExpenseResponse> => {
  const { data } = await apiClient.post<ExpenseResponse>('/expenses', payload)
  return data
}

export const updateExpense = async (
  expenseId: string,
  payload: UpdateExpenseRequest,
): Promise<ExpenseResponse> => {
  const { data } = await apiClient.patch<ExpenseResponse>(`/expenses/${expenseId}`, payload)
  return data
}

export const deleteExpense = async (expenseId: string): Promise<void> => {
  await apiClient.delete(`/expenses/${expenseId}`)
}
