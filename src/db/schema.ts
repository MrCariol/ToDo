import type { DBSchema } from 'idb'
import type { Task } from '../models/Task'
import type { TaskList } from '../models/TaskList'
import type { TaskCompletionLogEntry } from '../models/TaskCompletionLogEntry'

export const DB_NAME = 'todo-pwa-db'
export const DB_VERSION = 1

export interface TodoDbSchema extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: {
      'by-listId': string
      'by-dueDate': string
      'by-addedToTodayAt': string
      'by-createdAt': string
      'by-deletedAt': string
    }
  }
  lists: {
    key: string
    value: TaskList
    indexes: {
      'by-order': number
      'by-deletedAt': string
    }
  }
  taskCompletions: {
    key: string
    value: TaskCompletionLogEntry
    indexes: {
      'by-taskId': string
      'by-actionAt': string
    }
  }
}
