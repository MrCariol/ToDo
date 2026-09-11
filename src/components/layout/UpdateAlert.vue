<script setup lang="ts">
defineProps<{ show: boolean }>()
const emit = defineEmits<{ update: []; dismiss: [] }>()
</script>

<template>
  <div
    v-if="show"
    class="alert alert-info alert-dismissible d-flex align-items-center gap-2 position-fixed top-0 end-0 m-3 shadow-sm"
    role="alert"
  >
    <span>È disponibile un aggiornamento.</span>
    <button type="button" class="btn btn-sm btn-primary" @click="emit('update')">Aggiorna</button>
    <button type="button" class="btn-close" aria-label="Chiudi" @click="emit('dismiss')"></button>
  </div>
</template>
