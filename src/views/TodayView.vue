<script setup lang="ts">
import { onMounted } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useListsStore } from '../stores/lists'
import { todayISODate } from '../services/dateUtils'
import TaskListPanel from '../components/tasks/TaskListPanel.vue'

const tasksStore = useTasksStore()
const listsStore = useListsStore()

onMounted(() => {
  tasksStore.cleanupExpiredAddedToToday()
})
</script>

<template>
  <TaskListPanel
    title="Oggi"
    :tasks="tasksStore.todayTasks"
    :suggestions="tasksStore.todaySuggestions"
    :quick-add-list-id="listsStore.getDefaultListId()"
    :quick-add-due-date="todayISODate()"
    empty-message="Nessuna attività per oggi."
  />
</template>
