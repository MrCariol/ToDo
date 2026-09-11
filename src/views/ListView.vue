<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '../stores/tasks'
import { useListsStore } from '../stores/lists'
import TaskListPanel from '../components/tasks/TaskListPanel.vue'

const route = useRoute()
const tasksStore = useTasksStore()
const listsStore = useListsStore()

const listId = computed(() => route.params.listId as string)
const list = computed(() => listsStore.lists.find((l) => l.id === listId.value))
const tasks = computed(() => tasksStore.tasksByListId(listId.value))
</script>

<template>
  <TaskListPanel
    v-if="list"
    :title="list.name"
    :tasks="tasks"
    :quick-add-list-id="listId"
    :empty-message="`Nessuna attività in ${list.name}.`"
  />
</template>
