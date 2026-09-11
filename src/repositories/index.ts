import { IndexedDbTaskRepository } from './IndexedDbTaskRepository'
import { IndexedDbListRepository } from './IndexedDbListRepository'
import { IndexedDbCompletionLogRepository } from './IndexedDbCompletionLogRepository'
import type { ITaskRepository } from './ITaskRepository'
import type { IListRepository } from './IListRepository'
import type { ICompletionLogRepository } from './ICompletionLogRepository'

export const taskRepository: ITaskRepository = new IndexedDbTaskRepository()
export const listRepository: IListRepository = new IndexedDbListRepository()
export const completionLogRepository: ICompletionLogRepository = new IndexedDbCompletionLogRepository()
