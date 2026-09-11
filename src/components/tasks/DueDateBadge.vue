<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { todayISODate, parseISODate, daysFromToday } from '../../services/dateUtils'

const props = defineProps<{ dueDate?: string | null; completed?: boolean }>()

const badge = computed(() => {
  if (!props.dueDate) return null
  const dueDate = props.dueDate
  const label = format(parseISODate(dueDate), 'd MMM', { locale: it })

  if (props.completed) return { cssClass: 'text-bg-secondary', label }

  const today = todayISODate()
  if (dueDate < today) return { cssClass: 'text-bg-danger', label: `Scaduto ${label}` }
  if (dueDate === today) return { cssClass: 'text-bg-warning', label: 'Oggi' }
  if (daysFromToday(dueDate) <= 3) return { cssClass: 'text-bg-info', label }
  return { cssClass: 'text-bg-secondary', label }
})
</script>

<template>
  <span v-if="badge" class="badge rounded-pill" :class="badge.cssClass">{{ badge.label }}</span>
</template>
