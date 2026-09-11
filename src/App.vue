<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTasksStore } from './stores/tasks'
import { useListsStore } from './stores/lists'
import AppShell from './components/layout/AppShell.vue'

const tasksStore = useTasksStore()
const listsStore = useListsStore()
const ready = ref(false)

let cleanupInterval: number | undefined

onMounted(async () => {
  await listsStore.load()
  await tasksStore.load()
  ready.value = true
  cleanupInterval = window.setInterval(() => {
    tasksStore.cleanupExpiredAddedToToday()
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (cleanupInterval) window.clearInterval(cleanupInterval)
})
</script>

<template>
  <AppShell v-if="ready" />
  <div v-else class="d-flex justify-content-center align-items-center vh-100">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Caricamento...</span>
    </div>
  </div>
</template>
