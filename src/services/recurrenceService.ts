import { v4 as uuidv4 } from 'uuid'
import { addDays, addWeeks, addMonths, addYears, getDay, getDate, setDate, lastDayOfMonth } from 'date-fns'
import type { RecurrenceRule } from '../models/RecurrenceRule'
import type { Task } from '../models/Task'
import type { TaskCompletionLogEntry } from '../models/TaskCompletionLogEntry'
import { toISODate, parseISODate, todayISODate, nowISODateTime } from './dateUtils'

function clampDayOfMonth(date: Date, day: number): Date {
  const lastDay = getDate(lastDayOfMonth(date))
  return setDate(date, Math.min(day, lastDay))
}

/** Calcola la prossima occorrenza applicando la regola UNA sola volta a partire da `current`. */
export function computeNextOccurrence(current: Date, rule: RecurrenceRule): Date {
  switch (rule.type) {
    case 'daily':
      return addDays(current, rule.interval)

    case 'weekly': {
      const days =
        rule.daysOfWeek && rule.daysOfWeek.length > 0
          ? [...rule.daysOfWeek].sort((a, b) => a - b)
          : null
      if (!days) return addWeeks(current, rule.interval)
      const currentDay = getDay(current)
      const laterThisWeek = days.find((d) => d > currentDay)
      if (laterThisWeek !== undefined) {
        return addDays(current, laterThisWeek - currentDay)
      }
      return addDays(current, 7 - currentDay + days[0] + 7 * (rule.interval - 1))
    }

    case 'monthly': {
      const next = addMonths(current, rule.interval)
      return rule.dayOfMonth ? clampDayOfMonth(next, rule.dayOfMonth) : next
    }

    case 'yearly':
      return addYears(current, rule.interval || 1)

    case 'monthlyMultiDay': {
      const days =
        rule.daysOfMonth && rule.daysOfMonth.length > 0
          ? [...rule.daysOfMonth].sort((a, b) => a - b)
          : [getDate(current)]
      const currentDay = getDate(current)
      const laterThisMonth = days.find((d) => d > currentDay)
      if (laterThisMonth !== undefined) {
        return clampDayOfMonth(current, laterThisMonth)
      }
      return clampDayOfMonth(addMonths(current, 1), days[0])
    }
  }
}

interface RecurrenceActionResult {
  updatedTask: Task
  logEntry: TaskCompletionLogEntry
}

function assertRecurring(task: Task): asserts task is Task & { recurrence: RecurrenceRule; dueDate: string } {
  if (!task.recurrence || !task.dueDate) {
    throw new Error('Operazione di ricorrenza richiede un task con recurrence e dueDate')
  }
}

/**
 * Completa un'occorrenza: calcola la prossima dueDate applicando la regola una sola volta
 * a partire dalla dueDate ORIGINALE (non dalla data di completamento effettivo).
 * Il task ricorrente resta attivo (completed resta false) con la nuova dueDate.
 */
export function completeRecurringTask(task: Task): RecurrenceActionResult {
  assertRecurring(task)
  const fromDueDate = task.dueDate
  const toDueDate = toISODate(computeNextOccurrence(parseISODate(fromDueDate), task.recurrence))

  const updatedTask: Task = {
    ...task,
    dueDate: toDueDate,
    completed: false,
    completedAt: null,
    updatedAt: nowISODateTime(),
  }

  const logEntry: TaskCompletionLogEntry = {
    id: uuidv4(),
    taskId: task.id,
    action: 'completed',
    fromDueDate,
    toDueDate,
    actionAt: nowISODateTime(),
  }

  return { updatedTask, logEntry }
}

/**
 * Salta tutte le istanze scadute in un colpo solo: applica la regola iterativamente
 * finché la dueDate risultante non è >= oggi. Le istanze intermedie NON vengono marcate completate.
 */
export function skipRecurringTask(task: Task): RecurrenceActionResult {
  assertRecurring(task)
  const fromDueDate = task.dueDate
  const today = todayISODate()

  let current = parseISODate(fromDueDate)
  let currentISO = fromDueDate
  while (currentISO < today) {
    current = computeNextOccurrence(current, task.recurrence)
    currentISO = toISODate(current)
  }

  const updatedTask: Task = {
    ...task,
    dueDate: currentISO,
    updatedAt: nowISODateTime(),
  }

  const logEntry: TaskCompletionLogEntry = {
    id: uuidv4(),
    taskId: task.id,
    action: 'skipped',
    fromDueDate,
    toDueDate: currentISO,
    actionAt: nowISODateTime(),
  }

  return { updatedTask, logEntry }
}
