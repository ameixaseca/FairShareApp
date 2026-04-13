export type ExpenseStatus = 'Posted' | 'Corrected' | 'Cancelled'

export interface ExpenseResponse {
  id: string
  groupId: string
  paidByUserId: string
  amount: number
  description: string
  status: ExpenseStatus
  createdAt: string
}

export interface CreateExpenseRequest {
  groupId: string
  paidByUserId: string
  amount: number
  description: string
  excludedUserIds?: string[]
  requestId: string
}

export interface UpdateExpenseRequest {
  amount?: number
  description?: string
}
