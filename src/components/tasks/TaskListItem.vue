<script setup lang="ts">
import { mdiStar, mdiStarOutline, mdiRepeat } from '@mdi/js'
import type { Task } from '../../models/Task'
import { useTasksStore } from '../../stores/tasks'
import { useUiStore } from '../../stores/ui'
import AppIcon from '../icons/AppIcon.vue'
import DueDateBadge from './DueDateBadge.vue'

const props = defineProps<{ task: Task }>()
const tasksStore = useTasksStore()
const uiStore = useUiStore()

function openDetail() {
  uiStore.openTaskDetail(props.task.id)
}
</script>

<template>
  <li class="list-group-item d-flex align-items-center gap-2">
    <input
      class="form-check-input mt-0 flex-shrink-0"
      type="checkbox"
      :checked="task.completed"
      :aria-label="`Completa ${task.title}`"
      @change="tasksStore.toggleCompleted(task.id)"
    />
    <button
      type="button"
      class="btn btn-link text-start text-decoration-none flex-grow-1 p-0"
      :class="{ 'text-decoration-line-through text-body-secondary': task.completed }"
      @click="openDetail"
    >
      {{ task.title }}
    </button>
    <AppIcon v-if="task.recurrence" :path="mdiRepeat" class="text-body-secondary" />
    <DueDateBadge :due-date="task.dueDate" :completed="task.completed" />
    <button
      type="button"
      class="btn btn-link p-0"
      :aria-label="task.important ? 'Rimuovi da importanti' : 'Segna importante'"
      @click.stop="tasksStore.toggleImportant(task.id)"
    >
      <AppIcon :path="task.important ? mdiStar : mdiStarOutline" :class="task.important ? 'text-warning' : 'text-body-secondary'" />
    </button>
  </li>
</template>
