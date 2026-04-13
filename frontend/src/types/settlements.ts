export interface CreateSettlementRequest {
  groupId: string
  fromUserId: string
  toUserId: string
  amount: number
  requestId: string
}

export interface SettlementResponse {
  id: string
  groupId: string
  fromUserId: string
  toUserId: string
  amount: number
  createdAt: string
}
