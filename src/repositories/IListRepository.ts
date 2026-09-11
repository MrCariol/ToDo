import type { TaskList } from '../models/TaskList'

export interface IListRepository {
  getById(id: string): Promise<TaskList | undefined>
  /** Esclude le liste con deletedAt valorizzato */
  getAll(): Promise<TaskList[]>
  create(list: TaskList): Promise<TaskList>
  update(list: TaskList): Promise<TaskList>
  /** Soft-delete della lista, non elimina fisicamente il record */
  softDelete(id: string): Promise<void>
}
