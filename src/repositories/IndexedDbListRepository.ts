import { getDb, toPlain } from '../db'
import type { TaskList } from '../models/TaskList'
import type { IListRepository } from './IListRepository'

export class IndexedDbListRepository implements IListRepository {
  async getById(id: string): Promise<TaskList | undefined> {
    const db = await getDb()
    return db.get('lists', id)
  }

  async getAll(): Promise<TaskList[]> {
    const db = await getDb()
    const all = await db.getAll('lists')
    return all.filter((list) => !list.deletedAt)
  }

  async create(list: TaskList): Promise<TaskList> {
    const db = await getDb()
    const plain = toPlain(list)
    await db.put('lists', plain)
    return plain
  }

  async update(list: TaskList): Promise<TaskList> {
    const db = await getDb()
    const updated: TaskList = toPlain({ ...list, updatedAt: new Date().toISOString() })
    await db.put('lists', updated)
    return updated
  }

  async softDelete(id: string): Promise<void> {
    const db = await getDb()
    const list = await db.get('lists', id)
    if (!list) return
    const now = new Date().toISOString()
    await db.put('lists', toPlain({ ...list, deletedAt: now, updatedAt: now }))
  }
}
