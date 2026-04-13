export interface ObligationResponse {
  fromUserId: string
  fromUserName: string
  toUserId: string
  toUserName: string
  amount: number
}

export interface BalanceResponse {
  userId: string
  balance: number
  obligations: ObligationResponse[]
}
