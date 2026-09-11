import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { TaskList } from '../models/TaskList'
import { listRepository } from '../repositories'
import { nowISODateTime } from '../services/dateUtils'
import { useTasksStore } from './tasks'

const DEFAULT_LIST_NAME = 'Attività'

export const useListsStore = defineStore('lists', () => {
  const lists = ref<TaskList[]>([])
  const loaded = ref(false)

  async function load(): Promise<void> {
    if (loaded.value) return
    let all = await listRepository.getAll()
    if (all.length === 0) {
      const now = nowISODateTime()
      const defaultList: TaskList = {
        id: uuidv4(),
        name: DEFAULT_LIST_NAME,
        isDefault: true,
        order: 0,
        createdAt: now,
        updatedAt: now,
      }
      await listRepository.create(defaultList)
      all = [defaultList]
    }
    lists.value = all.sort((a, b) => a.order - b.order)
    loaded.value = true
  }

  function getDefaultListId(): string {
    const found = lists.value.find((list) => list.isDefault)
    return found ? found.id : lists.value[0].id
  }

  async function createList(name: string, color?: string): Promise<TaskList> {
    const now = nowISODateTime()
    const list: TaskList = {
      id: uuidv4(),
      name,
      color,
      order: lists.value.length,
      createdAt: now,
      updatedAt: now,
    }
    await listRepository.create(list)
    lists.value.push(list)
    return list
  }

  async function updateListMeta(id: string, meta: { name: string; color?: string }): Promise<void> {
    const list = lists.value.find((l) => l.id === id)
    if (!list) return
    const updated = await listRepository.update({ ...list, ...meta })
    const index = lists.value.findIndex((l) => l.id === id)
    lists.value[index] = updated
  }

  async function deleteList(id: string): Promise<void> {
    const tasksStore = useTasksStore()
    await tasksStore.softDeleteTasksByListId(id)
    await listRepository.softDelete(id)
    lists.value = lists.value.filter((l) => l.id !== id)
  }

  return { lists, loaded, load, getDefaultListId, createList, updateListMeta, deleteList }
})
