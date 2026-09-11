<script setup lang="ts">
import { useTasksStore } from '../stores/tasks'
import { useListsStore } from '../stores/lists'
import TaskListPanel from '../components/tasks/TaskListPanel.vue'

const tasksStore = useTasksStore()
const listsStore = useListsStore()
</script>

<template>
  <TaskListPanel
    title="Importante"
    :tasks="tasksStore.importantTasks"
    :quick-add-list-id="listsStore.getDefaultListId()"
    :quick-add-important="true"
    empty-message="Nessuna attività importante."
  />
</template>
