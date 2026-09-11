<script setup lang="ts">
import { computed, useId } from 'vue'
import type { Task } from '../../models/Task'
import QuickAddTask from './QuickAddTask.vue'
import SuggestionsPanel from './SuggestionsPanel.vue'
import TaskListItem from './TaskListItem.vue'

const props = withDefaults(
  defineProps<{
    title: string
    tasks: Task[]
    suggestions?: Task[]
    quickAddListId: string
    quickAddDueDate?: string | null
    quickAddImportant?: boolean
    emptyMessage?: string
  }>(),
  { suggestions: () => [], quickAddDueDate: null, quickAddImportant: false, emptyMessage: 'Nessuna attività.' },
)

const completedSectionId = useId()

const activeTasks = computed(() => props.tasks.filter((t) => !t.completed))
const completedTasks = computed(() => props.tasks.filter((t) => t.completed))
</script>

<template>
  <div>
    <h1 class="h3 mb-3">{{ title }}</h1>

    <QuickAddTask
      class="mb-3"
      :list-id="quickAddListId"
      :due-date="quickAddDueDate"
      :important="quickAddImportant"
    />

    <SuggestionsPanel v-if="suggestions.length > 0" class="mb-3" :suggestions="suggestions" />

    <p v-if="activeTasks.length === 0 && completedTasks.length === 0" class="text-body-secondary">
      {{ emptyMessage }}
    </p>

    <ul v-if="activeTasks.length > 0" class="list-group mb-3">
      <TaskListItem v-for="task in activeTasks" :key="task.id" :task="task" />
    </ul>

    <div v-if="completedTasks.length > 0">
      <button
        class="btn btn-link text-decoration-none px-0"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#${completedSectionId}`"
      >
        Completati ({{ completedTasks.length }})
      </button>
      <ul :id="completedSectionId" class="list-group collapse">
        <TaskListItem v-for="task in completedTasks" :key="task.id" :task="task" />
      </ul>
    </div>
  </div>
</template>
