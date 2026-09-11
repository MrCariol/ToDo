import type { RecurrenceRule } from './RecurrenceRule'

/** Solo giorno, formato 'YYYY-MM-DD' */
export type ISODate = string
export type ISODateTime = string

export interface Task {
  id: string
  title: string
  notes?: string
  completed: boolean
  completedAt?: ISODateTime | null
  important: boolean
  listId: string
  dueDate?: ISODate | null
  /** "Aggiunto a Oggi", concettualmente distinto da dueDate */
  addedToTodayAt?: ISODate | null
  recurrence?: RecurrenceRule | null
  createdAt: ISODateTime
  updatedAt: ISODateTime
  deletedAt?: ISODateTime | null
  // Predisposizione per una futura sincronizzazione remota (nessuna logica implementata ora)
  remoteId?: string | null
  syncVersion?: number
  dirty?: boolean
}
