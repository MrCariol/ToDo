<script setup lang="ts">
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { useTasksStore } from '../stores/tasks'
import { parseISODate } from '../services/dateUtils'
import type { PlannedGroup } from '../services/plannedViewService'
import TaskListItem from '../components/tasks/TaskListItem.vue'

const tasksStore = useTasksStore()

function formatGroupLabel(group: PlannedGroup): string {
  if (group.isOverdue) return 'Scaduto'
  return format(parseISODate(group.key), 'EEEE d MMMM', { locale: it })
}
</script>

<template>
  <div>
    <h1 class="h3 mb-3">Pianificato</h1>
    <p v-if="tasksStore.plannedGroups.length === 0" class="text-body-secondary">
      Nessuna attività pianificata.
    </p>
    <div v-for="group in tasksStore.plannedGroups" :key="group.key" class="mb-4">
      <h2 class="h6 text-uppercase mb-2" :class="group.isOverdue ? 'text-danger' : 'text-body-secondary'">
        {{ formatGroupLabel(group) }}
      </h2>
      <ul class="list-group">
        <TaskListItem v-for="task in group.tasks" :key="task.id" :task="task" />
      </ul>
    </div>
  </div>
</template>
