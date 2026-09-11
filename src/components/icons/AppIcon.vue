<script setup lang="ts">
withDefaults(defineProps<{ path: string; size?: number }>(), { size: 20 })
</script>

<template>
  <svg class="app-icon" :width="size" :height="size" viewBox="0 0 24 24">
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<style scoped>
/* Necessario: Bootstrap non fornisce utility per l'allineamento verticale di SVG inline rispetto al testo. */
.app-icon {
  vertical-align: -0.2em;
  flex-shrink: 0;
}
</style>
