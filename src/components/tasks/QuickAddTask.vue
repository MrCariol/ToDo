<script setup lang="ts">
import { ref } from 'vue'
import { mdiPlus } from '@mdi/js'
import AppIcon from '../icons/AppIcon.vue'
import { useTasksStore } from '../../stores/tasks'

const props = withDefaults(
  defineProps<{
    listId: string
    dueDate?: string | null
    important?: boolean
  }>(),
  { dueDate: null, important: false },
)

const tasksStore = useTasksStore()
const title = ref('')

async function submit() {
  const trimmed = title.value.trim()
  if (!trimmed) return
  await tasksStore.addTask({
    title: trimmed,
    listId: props.listId,
    dueDate: props.dueDate,
    important: props.important,
  })
  title.value = ''
}
</script>

<template>
  <form class="input-group" @submit.prevent="submit">
    <span class="input-group-text bg-transparent"><AppIcon :path="mdiPlus" /></span>
    <input
      v-model="title"
      type="text"
      class="form-control"
      placeholder="Aggiungi un'attività"
      aria-label="Nuova attività"
    />
    <button class="btn btn-primary" type="submit">Aggiungi</button>
  </form>
</template>
