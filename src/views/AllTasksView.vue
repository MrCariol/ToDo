<script setup lang="ts">
import { useTasksStore } from '../stores/tasks'
import { useListsStore } from '../stores/lists'
import TaskListPanel from '../components/tasks/TaskListPanel.vue'

const tasksStore = useTasksStore()
const listsStore = useListsStore()
</script>

<template>
  <TaskListPanel
    title="Tutti"
    :tasks="tasksStore.tasks"
    :quick-add-list-id="listsStore.getDefaultListId()"
    empty-message="Nessuna attività."
  />
</template>
