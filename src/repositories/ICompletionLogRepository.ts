import type { TaskCompletionLogEntry } from '../models/TaskCompletionLogEntry'

export interface ICompletionLogRepository {
  add(entry: TaskCompletionLogEntry): Promise<TaskCompletionLogEntry>
  getByTaskId(taskId: string): Promise<TaskCompletionLogEntry[]>
}
