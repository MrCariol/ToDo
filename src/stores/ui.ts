import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const selectedTaskId = ref<string | null>(null)
  const listFormEditingId = ref<string | null | undefined>(undefined)

  function openTaskDetail(id: string): void {
    selectedTaskId.value = id
  }

  function closeTaskDetail(): void {
    selectedTaskId.value = null
  }

  /** null = crea nuova lista, string = modifica lista esistente */
  function openListForm(editingId: string | null = null): void {
    listFormEditingId.value = editingId
  }

  function closeListForm(): void {
    listFormEditingId.value = undefined
  }

  return { selectedTaskId, listFormEditingId, openTaskDetail, closeTaskDetail, openListForm, closeListForm }
})
