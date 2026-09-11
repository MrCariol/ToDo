<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useTasksStore } from './stores/tasks'
import { useListsStore } from './stores/lists'
import AppShell from './components/layout/AppShell.vue'

const UPDATE_CHECK_INTERVAL_MS = 60 * 1000

// registerType 'autoUpdate' (vite.config.ts): una nuova versione si attiva e ricarica
// la pagina da sola, senza chiedere conferma. Il controllo periodico serve perché,
// essendo una SPA, l'utente potrebbe non fare mai un reload completo che lo attiverebbe.
useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return
    setInterval(async () => {
      if (registration.installing || !navigator.onLine) return
      try {
        const resp = await fetch(swUrl, { cache: 'no-store' })
        if (resp.status === 200) await registration.update()
      } catch {
        // rete non raggiungibile: si riprova al prossimo intervallo
      }
    }, UPDATE_CHECK_INTERVAL_MS)
  },
})

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
