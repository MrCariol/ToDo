import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Task } from '../models/Task'
import type { RecurrenceRule } from '../models/RecurrenceRule'
import { taskRepository, completionLogRepository } from '../repositories'
import { nowISODateTime, todayISODate } from '../services/dateUtils'
import { completeRecurringTask, skipRecurringTask } from '../services/recurrenceService'
import { getTodayTasks, getTasksWithExpiredAddedToToday } from '../services/todayViewService'
import { getPlannedGroups } from '../services/plannedViewService'
import { getTodaySuggestions } from '../services/suggestionsService'

export interface NewTaskInput {
  title: string
  listId: string
  dueDate?: string | null
  important?: boolean
  notes?: string
  recurrence?: RecurrenceRule | null
  addedToTodayAt?: string | null
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loaded = ref(false)

  const importantTasks = computed(() => tasks.value.filter((t) => t.important))
  const todayTasks = computed(() => getTodayTasks(tasks.value))
  const plannedGroups = computed(() => getPlannedGroups(tasks.value))
  const todaySuggestions = computed(() => getTodaySuggestions(tasks.value))

  function tasksByListId(listId: string): Task[] {
    return tasks.value.filter((t) => t.listId === listId)
  }

  async function load(): Promise<void> {
    if (loaded.value) return
    tasks.value = await taskRepository.getAll()
    loaded.value = true
    await cleanupExpiredAddedToToday()
  }

  function upsertLocal(task: Task): void {
    const index = tasks.value.findIndex((t) => t.id === task.id)
    if (index === -1) tasks.value.push(task)
    else tasks.value[index] = task
  }

  async function addTask(input: NewTaskInput): Promise<Task> {
    const now = nowISODateTime()
    const task: Task = {
      id: uuidv4(),
      title: input.title,
      notes: input.notes,
      completed: false,
      important: input.important ?? false,
      listId: input.listId,
      dueDate: input.dueDate ?? null,
      addedToTodayAt: input.addedToTodayAt ?? null,
      recurrence: input.recurrence ?? null,
      createdAt: now,
      updatedAt: now,
    }
    await taskRepository.create(task)
    upsertLocal(task)
    return task
  }

  async function updateTask(task: Task): Promise<void> {
    const updated = await taskRepository.update(task)
    upsertLocal(updated)
  }

  async function toggleImportant(id: string): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    await updateTask({ ...task, important: !task.important })
  }

  async function addToToday(id: string): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    await updateTask({ ...task, addedToTodayAt: todayISODate() })
  }

  async function removeFromToday(id: string): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    await updateTask({ ...task, addedToTodayAt: null })
  }

  async function completeTask(id: string): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    if (task.recurrence && task.dueDate) {
      const { updatedTask, logEntry } = completeRecurringTask(task)
      await taskRepository.update(updatedTask)
      await completionLogRepository.add(logEntry)
      upsertLocal(updatedTask)
    } else {
      await updateTask({ ...task, completed: true, completedAt: nowISODateTime() })
    }
  }

  async function uncompleteTask(id: string): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    await updateTask({ ...task, completed: false, completedAt: null })
  }

  async function toggleCompleted(id: string): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    if (task.completed) await uncompleteTask(id)
    else await completeTask(id)
  }

  async function skipRecurrence(id: string): Promise<void> {
    const task = tasks.value.find((t) => t.id === id)
    if (!task || !task.recurrence || !task.dueDate) return
    const { updatedTask, logEntry } = skipRecurringTask(task)
    await taskRepository.update(updatedTask)
    await completionLogRepository.add(logEntry)
    upsertLocal(updatedTask)
  }

  async function deleteTask(id: string): Promise<void> {
    await taskRepository.softDelete(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  async function softDeleteTasksByListId(listId: string): Promise<void> {
    const toDelete = tasks.value.filter((t) => t.listId === listId)
    for (const task of toDelete) {
      await taskRepository.softDelete(task.id)
    }
    tasks.value = tasks.value.filter((t) => t.listId !== listId)
  }

  async function cleanupExpiredAddedToToday(): Promise<void> {
    const expired = getTasksWithExpiredAddedToToday(tasks.value)
    for (const task of expired) {
      const updated = await taskRepository.update({ ...task, addedToTodayAt: null })
      upsertLocal(updated)
    }
  }

  return {
    tasks,
    loaded,
    importantTasks,
    todayTasks,
    plannedGroups,
    todaySuggestions,
    tasksByListId,
    load,
    addTask,
    updateTask,
    toggleImportant,
    addToToday,
    removeFromToday,
    completeTask,
    uncompleteTask,
    toggleCompleted,
    skipRecurrence,
    deleteTask,
    softDeleteTasksByListId,
    cleanupExpiredAddedToToday,
  }
})
