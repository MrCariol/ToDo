<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { mdiSkipNext, mdiTrashCanOutline } from '@mdi/js'
import { useTasksStore } from '../../stores/tasks'
import { useListsStore } from '../../stores/lists'
import { useUiStore } from '../../stores/ui'
import type { RecurrenceRule } from '../../models/RecurrenceRule'
import { todayISODate } from '../../services/dateUtils'
import AppIcon from '../icons/AppIcon.vue'
import RecurrencePicker from './RecurrencePicker.vue'

const tasksStore = useTasksStore()
const listsStore = useListsStore()
const uiStore = useUiStore()

const task = computed(() => tasksStore.tasks.find((t) => t.id === uiStore.selectedTaskId) ?? null)

const draft = reactive({
  title: '',
  notes: '',
  listId: '',
  dueDate: null as string | null,
  addedToToday: false,
  recurrence: null as RecurrenceRule | null,
})

watch(
  task,
  (current) => {
    if (!current) return
    draft.title = current.title
    draft.notes = current.notes ?? ''
    draft.listId = current.listId
    draft.dueDate = current.dueDate ?? null
    draft.addedToToday = !!current.addedToTodayAt
    draft.recurrence = current.recurrence ?? null
  },
  { immediate: true },
)

function close() {
  uiStore.closeTaskDetail()
}

async function commit() {
  if (!task.value) return
  await tasksStore.updateTask({
    ...task.value,
    title: draft.title.trim() || task.value.title,
    notes: draft.notes || undefined,
    listId: draft.listId,
    dueDate: draft.dueDate || null,
    addedToTodayAt: draft.addedToToday ? todayISODate() : null,
    recurrence: draft.recurrence,
  })
}

function onRecurrenceChange(value: RecurrenceRule | null) {
  draft.recurrence = value
  commit()
}

async function removeTask() {
  if (!task.value) return
  if (!confirm(`Eliminare "${task.value.title}"?`)) return
  await tasksStore.deleteTask(task.value.id)
  close()
}
</script>

<template>
  <template v-if="task">
    <div class="offcanvas-backdrop fade show" @click="close"></div>
    <div class="offcanvas offcanvas-end show" tabindex="-1">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Dettagli attività</h5>
        <button type="button" class="btn-close" aria-label="Chiudi" @click="close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column gap-3">
        <div class="form-check">
          <input
            id="detail-completed"
            class="form-check-input"
            type="checkbox"
            :checked="task.completed"
            @change="tasksStore.toggleCompleted(task.id)"
          />
          <label class="form-check-label" for="detail-completed">Completata</label>
        </div>

        <div>
          <label class="form-label" for="detail-title">Titolo</label>
          <input id="detail-title" v-model="draft.title" type="text" class="form-control" @blur="commit" />
        </div>

        <div class="form-check form-switch">
          <input
            id="detail-important"
            class="form-check-input"
            type="checkbox"
            role="switch"
            :checked="task.important"
            @change="tasksStore.toggleImportant(task.id)"
          />
          <label class="form-check-label" for="detail-important">Importante</label>
        </div>

        <div class="form-check form-switch">
          <input
            id="detail-today"
            v-model="draft.addedToToday"
            class="form-check-input"
            type="checkbox"
            role="switch"
            @change="commit"
          />
          <label class="form-check-label" for="detail-today">Aggiungi a Oggi</label>
        </div>

        <div>
          <label class="form-label" for="detail-list">Lista</label>
          <select id="detail-list" v-model="draft.listId" class="form-select" @change="commit">
            <option v-for="list in listsStore.lists" :key="list.id" :value="list.id">{{ list.name }}</option>
          </select>
        </div>

        <div>
          <label class="form-label" for="detail-duedate">Scadenza</label>
          <input id="detail-duedate" v-model="draft.dueDate" type="date" class="form-control" @change="commit" />
        </div>

        <RecurrencePicker :model-value="draft.recurrence" @update:model-value="onRecurrenceChange" />

        <button
          v-if="task.recurrence"
          type="button"
          class="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
          @click="tasksStore.skipRecurrence(task.id)"
        >
          <AppIcon :path="mdiSkipNext" />
          Salta alla prossima non scaduta
        </button>

        <div>
          <label class="form-label" for="detail-notes">Note</label>
          <textarea id="detail-notes" v-model="draft.notes" class="form-control" rows="4" @blur="commit"></textarea>
        </div>

        <button
          type="button"
          class="btn btn-outline-danger d-inline-flex align-items-center gap-2 mt-auto"
          @click="removeTask"
        >
          <AppIcon :path="mdiTrashCanOutline" />
          Elimina attività
        </button>
      </div>
    </div>
  </template>
</template>
