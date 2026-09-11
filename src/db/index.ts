import { openDB, type IDBPDatabase } from 'idb'
import { DB_NAME, DB_VERSION, type TodoDbSchema } from './schema'

/**
 * IndexedDB richiede valori "structured-cloneable": un oggetto reso reattivo da Vue
 * (Proxy) non lo è. Questo normalizza in un oggetto piano prima di ogni scrittura.
 */
export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

let dbPromise: Promise<IDBPDatabase<TodoDbSchema>> | null = null

export function getDb(): Promise<IDBPDatabase<TodoDbSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<TodoDbSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const tasks = db.createObjectStore('tasks', { keyPath: 'id' })
        tasks.createIndex('by-listId', 'listId')
        tasks.createIndex('by-dueDate', 'dueDate')
        tasks.createIndex('by-addedToTodayAt', 'addedToTodayAt')
        tasks.createIndex('by-createdAt', 'createdAt')
        tasks.createIndex('by-deletedAt', 'deletedAt')

        const lists = db.createObjectStore('lists', { keyPath: 'id' })
        lists.createIndex('by-order', 'order')
        lists.createIndex('by-deletedAt', 'deletedAt')

        const taskCompletions = db.createObjectStore('taskCompletions', { keyPath: 'id' })
        taskCompletions.createIndex('by-taskId', 'taskId')
        taskCompletions.createIndex('by-actionAt', 'actionAt')
      },
    })
  }
  return dbPromise
}
