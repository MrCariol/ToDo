import type { Task } from '../models/Task'
import { todayISODate } from './dateUtils'

/** Unione: task con dueDate = oggi e task aggiunti manualmente a Oggi (addedToTodayAt = oggi). */
export function getTodayTasks(allTasks: Task[]): Task[] {
  const today = todayISODate()
  return allTasks.filter((task) => task.dueDate === today || task.addedToTodayAt === today)
}

/** Task il cui addedToTodayAt appartiene a un giorno diverso da oggi: vanno rimossi da "Oggi". */
export function getTasksWithExpiredAddedToToday(allTasks: Task[]): Task[] {
  const today = todayISODate()
  return allTasks.filter((task) => task.addedToTodayAt && task.addedToTodayAt !== today)
}
