<script setup lang="ts">
import { mdiLightbulbOnOutline, mdiPlus } from '@mdi/js'
import type { Task } from '../../models/Task'
import { useTasksStore } from '../../stores/tasks'
import AppIcon from '../icons/AppIcon.vue'
import DueDateBadge from './DueDateBadge.vue'

defineProps<{ suggestions: Task[] }>()
const tasksStore = useTasksStore()
</script>

<template>
  <div class="card">
    <div class="card-header d-flex align-items-center gap-2">
      <AppIcon :path="mdiLightbulbOnOutline" class="text-warning" />
      <span>Suggerimenti per Oggi</span>
    </div>
    <ul class="list-group list-group-flush">
      <li v-for="task in suggestions" :key="task.id" class="list-group-item d-flex align-items-center gap-2">
        <span class="flex-grow-1">{{ task.title }}</span>
        <DueDateBadge :due-date="task.dueDate" />
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          aria-label="Aggiungi a Oggi"
          @click="tasksStore.addToToday(task.id)"
        >
          <AppIcon :path="mdiPlus" :size="16" />
        </button>
      </li>
    </ul>
  </div>
</template>
