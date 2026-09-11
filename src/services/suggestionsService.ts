import type { Task } from '../models/Task'
import { todayISODate, daysFromToday, daysSince } from './dateUtils'

const UPCOMING_WINDOW_DAYS = 3
const RECENT_CREATION_WINDOW_DAYS = 3

/**
 * Task candidati per la vista Oggi, non ancora presenti in Oggi, ordinati per urgenza:
 * 1. scaduti, 2. in scadenza nei prossimi giorni, 3. creati di recente senza scadenza.
 */
export function getTodaySuggestions(allTasks: Task[]): Task[] {
  const today = todayISODate()

  const candidates = allTasks.filter(
    (task) => !task.completed && task.dueDate !== today && task.addedToTodayAt !== today,
  )

  const overdue = candidates
    .filter((task): task is Task & { dueDate: string } => !!task.dueDate && task.dueDate < today)
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))

  const upcoming = candidates
    .filter(
      (task): task is Task & { dueDate: string } =>
        !!task.dueDate && task.dueDate > today && daysFromToday(task.dueDate) <= UPCOMING_WINDOW_DAYS,
    )
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))

  const recentNoDueDate = candidates
    .filter((task) => !task.dueDate && daysSince(task.createdAt) <= RECENT_CREATION_WINDOW_DAYS)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))

  return [...overdue, ...upcoming, ...recentNoDueDate]
}
