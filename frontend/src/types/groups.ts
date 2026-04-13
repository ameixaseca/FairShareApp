export type MemberRole = 'Owner' | 'Admin' | 'Member'
export type MemberStatus = 'Active' | 'Inactive'

export interface GroupMember {
  userId: string
  name: string
  role: MemberRole
  status: MemberStatus
}

export interface GroupResponse {
  id: string
  name: string
  currency: string
  ownerId: string
  members: GroupMember[]
}

export interface CreateGroupRequest {
  name: string
  currency: string
  ownerId: string
}
