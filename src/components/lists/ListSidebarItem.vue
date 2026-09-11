<script setup lang="ts">
import { mdiPencilOutline } from '@mdi/js'
import type { TaskList } from '../../models/TaskList'
import { useUiStore } from '../../stores/ui'
import AppIcon from '../icons/AppIcon.vue'

defineProps<{ list: TaskList }>()
const uiStore = useUiStore()
</script>

<template>
  <div class="d-flex align-items-center">
    <router-link
      :to="`/list/${list.id}`"
      active-class="active"
      class="nav-link flex-grow-1 d-flex align-items-center gap-2"
    >
      <span class="badge rounded-pill" :class="`text-bg-${list.color ?? 'secondary'}`">&nbsp;</span>
      {{ list.name }}
    </router-link>
    <button
      type="button"
      class="btn btn-sm btn-link"
      aria-label="Modifica lista"
      @click="uiStore.openListForm(list.id)"
    >
      <AppIcon :path="mdiPencilOutline" :size="16" />
    </button>
  </div>
</template>
