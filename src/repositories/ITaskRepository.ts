import type { Task } from '../models/Task'

export interface ITaskRepository {
  getById(id: string): Promise<Task | undefined>
  /** Esclude i task con deletedAt valorizzato */
  getAll(): Promise<Task[]>
  create(task: Task): Promise<Task>
  update(task: Task): Promise<Task>
  /** Soft-delete: valorizza deletedAt, non elimina fisicamente il record */
  softDelete(id: string): Promise<void>
}
