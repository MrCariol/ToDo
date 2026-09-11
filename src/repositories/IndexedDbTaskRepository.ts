import { getDb, toPlain } from '../db'
import type { Task } from '../models/Task'
import type { ITaskRepository } from './ITaskRepository'

export class IndexedDbTaskRepository implements ITaskRepository {
  async getById(id: string): Promise<Task | undefined> {
    const db = await getDb()
    return db.get('tasks', id)
  }

  async getAll(): Promise<Task[]> {
    const db = await getDb()
    const all = await db.getAll('tasks')
    return all.filter((task) => !task.deletedAt)
  }

  async create(task: Task): Promise<Task> {
    const db = await getDb()
    const plain = toPlain(task)
    await db.put('tasks', plain)
    return plain
  }

  async update(task: Task): Promise<Task> {
    const db = await getDb()
    const updated: Task = toPlain({ ...task, updatedAt: new Date().toISOString() })
    await db.put('tasks', updated)
    return updated
  }

  async softDelete(id: string): Promise<void> {
    const db = await getDb()
    const task = await db.get('tasks', id)
    if (!task) return
    const now = new Date().toISOString()
    await db.put('tasks', toPlain({ ...task, deletedAt: now, updatedAt: now }))
  }
}
