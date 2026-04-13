export type LedgerEntryType = 'Expense' | 'Settlement' | 'Correction' | 'Cancellation'

export interface LedgerEntryResponse {
  id: string
  type: LedgerEntryType
  description: string
  amount: number
  createdAt: string
}

export interface LedgerListResponse {
  entries: LedgerEntryResponse[]
}
