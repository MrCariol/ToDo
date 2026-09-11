import type { Task } from '../models/Task'
import { todayISODate } from './dateUtils'

export interface PlannedGroup {
  key: string
  label: string
  isOverdue: boolean
  tasks: Task[]
}

/** Task con dueDate, raggruppati per data. Il gruppo "Scaduto" (non completati) viene per primo. */
export function getPlannedGroups(allTasks: Task[]): PlannedGroup[] {
  const today = todayISODate()
  const withDueDate = allTasks.filter((task): task is Task & { dueDate: string } => !!task.dueDate)

  const overdue = withDueDate.filter((task) => task.dueDate < today && !task.completed)
  const upcoming = withDueDate.filter((task) => task.dueDate >= today)

  const groups = new Map<string, Task[]>()
  for (const task of upcoming) {
    const bucket = groups.get(task.dueDate) ?? []
    bucket.push(task)
    groups.set(task.dueDate, bucket)
  }

  const result: PlannedGroup[] = []
  if (overdue.length > 0) {
    result.push({ key: 'overdue', label: 'Scaduto', isOverdue: true, tasks: overdue })
  }
  for (const date of [...groups.keys()].sort()) {
    result.push({ key: date, label: date, isOverdue: false, tasks: groups.get(date)! })
  }
  return result
}
