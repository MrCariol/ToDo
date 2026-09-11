import type { ISODateTime } from './Task'

export interface TaskList {
  id: string
  name: string
  /** Classe colore Bootstrap, es. 'primary', 'success' (mai un hex custom) */
  color?: string
  isDefault?: boolean
  order: number
  createdAt: ISODateTime
  updatedAt: ISODateTime
  deletedAt?: ISODateTime | null
  remoteId?: string | null
  syncVersion?: number
  dirty?: boolean
}
