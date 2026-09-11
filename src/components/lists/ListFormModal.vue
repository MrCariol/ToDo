<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useListsStore } from '../../stores/lists'
import { useTasksStore } from '../../stores/tasks'
import { useUiStore } from '../../stores/ui'

const listsStore = useListsStore()
const tasksStore = useTasksStore()
const uiStore = useUiStore()

const COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark']

const isOpen = computed(() => uiStore.listFormEditingId !== undefined)
const editingList = computed(() =>
  uiStore.listFormEditingId ? listsStore.lists.find((l) => l.id === uiStore.listFormEditingId) : null,
)

const form = reactive({ name: '', color: 'primary' })

watch(isOpen, (open) => {
  if (!open) return
  form.name = editingList.value?.name ?? ''
  form.color = editingList.value?.color ?? 'primary'
})

function close() {
  uiStore.closeListForm()
}

async function submit() {
  const name = form.name.trim()
  if (!name) return
  if (editingList.value) {
    await listsStore.updateListMeta(editingList.value.id, { name, color: form.color })
  } else {
    await listsStore.createList(name, form.color)
  }
  close()
}

async function removeList() {
  if (!editingList.value) return
  const count = tasksStore.tasksByListId(editingList.value.id).length
  const message =
    count > 0
      ? `Eliminare "${editingList.value.name}" e le sue ${count} attività?`
      : `Eliminare "${editingList.value.name}"?`
  if (!confirm(message)) return
  await listsStore.deleteList(editingList.value.id)
  close()
}
</script>

<template>
  <template v-if="isOpen">
    <div class="modal-backdrop fade show" @click="close"></div>
    <div class="modal d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingList ? 'Modifica lista' : 'Nuova lista' }}</h5>
            <button type="button" class="btn-close" aria-label="Chiudi" @click="close"></button>
          </div>
          <form @submit.prevent="submit">
            <div class="modal-body d-flex flex-column gap-3">
              <div>
                <label class="form-label" for="list-name">Nome</label>
                <input id="list-name" v-model="form.name" type="text" class="form-control" required />
              </div>
              <div>
                <label class="form-label" for="list-color">Colore</label>
                <select id="list-color" v-model="form.color" class="form-select">
                  <option v-for="color in COLORS" :key="color" :value="color">{{ color }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button
                v-if="editingList && !editingList.isDefault"
                type="button"
                class="btn btn-outline-danger me-auto"
                @click="removeList"
              >
                Elimina lista
              </button>
              <button type="button" class="btn btn-secondary" @click="close">Annulla</button>
              <button type="submit" class="btn btn-primary">Salva</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
</template>
