import { getDb, toPlain } from '../db'
import type { TaskCompletionLogEntry } from '../models/TaskCompletionLogEntry'
import type { ICompletionLogRepository } from './ICompletionLogRepository'

export class IndexedDbCompletionLogRepository implements ICompletionLogRepository {
  async add(entry: TaskCompletionLogEntry): Promise<TaskCompletionLogEntry> {
    const db = await getDb()
    const plain = toPlain(entry)
    await db.put('taskCompletions', plain)
    return plain
  }

  async getByTaskId(taskId: string): Promise<TaskCompletionLogEntry[]> {
    const db = await getDb()
    return db.getAllFromIndex('taskCompletions', 'by-taskId', taskId)
  }
}
