import type { ISODate, ISODateTime } from './Task'

export type TaskCompletionAction = 'completed' | 'skipped'

export interface TaskCompletionLogEntry {
  id: string
  taskId: string
  action: TaskCompletionAction
  fromDueDate: ISODate
  toDueDate: ISODate | null
  actionAt: ISODateTime
}
