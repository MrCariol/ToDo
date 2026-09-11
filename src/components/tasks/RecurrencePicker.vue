<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RecurrenceRule, RecurrenceType } from '../../models/RecurrenceRule'

const props = defineProps<{ modelValue: RecurrenceRule | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: RecurrenceRule | null] }>()

const WEEKDAYS = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mer' },
  { value: 4, label: 'Gio' },
  { value: 5, label: 'Ven' },
  { value: 6, label: 'Sab' },
  { value: 0, label: 'Dom' },
]

type Mode = 'none' | RecurrenceType

const mode = ref<Mode>(props.modelValue?.type ?? 'none')
const interval = ref(props.modelValue?.interval ?? 1)
const daysOfWeek = ref<number[]>(props.modelValue?.daysOfWeek ?? [])
const dayOfMonth = ref(props.modelValue?.dayOfMonth ?? 1)
const daysOfMonthText = ref((props.modelValue?.daysOfMonth ?? []).join(', '))

function toggleWeekday(day: number) {
  const index = daysOfWeek.value.indexOf(day)
  if (index === -1) daysOfWeek.value.push(day)
  else daysOfWeek.value.splice(index, 1)
  daysOfWeek.value = [...daysOfWeek.value].sort((a, b) => a - b)
}

function parseDaysOfMonth(): number[] {
  return daysOfMonthText.value
    .split(',')
    .map((part) => parseInt(part.trim(), 10))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 31)
}

function currentRule(): RecurrenceRule | null {
  if (mode.value === 'none') return null
  const rule: RecurrenceRule = { type: mode.value, interval: interval.value || 1 }
  if (mode.value === 'weekly') rule.daysOfWeek = daysOfWeek.value.length > 0 ? daysOfWeek.value : undefined
  if (mode.value === 'monthly') rule.dayOfMonth = dayOfMonth.value
  if (mode.value === 'monthlyMultiDay') rule.daysOfMonth = parseDaysOfMonth()
  return rule
}

watch([mode, interval, daysOfWeek, dayOfMonth, daysOfMonthText], () => {
  emit('update:modelValue', currentRule())
})
</script>

<template>
  <div>
    <label class="form-label" for="recurrence-mode">Ripetizione</label>
    <select id="recurrence-mode" v-model="mode" class="form-select mb-2">
      <option value="none">Nessuna ripetizione</option>
      <option value="daily">Ogni giorno</option>
      <option value="weekly">Ogni settimana</option>
      <option value="monthly">Ogni mese</option>
      <option value="yearly">Ogni anno</option>
      <option value="monthlyMultiDay">Più date nello stesso mese</option>
    </select>

    <div v-if="mode !== 'none' && mode !== 'monthlyMultiDay'" class="input-group mb-2">
      <span class="input-group-text">Ogni</span>
      <input v-model.number="interval" type="number" min="1" class="form-control" />
      <span class="input-group-text">
        {{ mode === 'daily' ? 'giorni' : mode === 'weekly' ? 'settimane' : mode === 'monthly' ? 'mesi' : 'anni' }}
      </span>
    </div>

    <div v-if="mode === 'weekly'" class="btn-group mb-2" role="group" aria-label="Giorni della settimana">
      <template v-for="day in WEEKDAYS" :key="day.value">
        <input
          :id="`weekday-${day.value}`"
          type="checkbox"
          class="btn-check"
          autocomplete="off"
          :checked="daysOfWeek.includes(day.value)"
          @change="toggleWeekday(day.value)"
        />
        <label class="btn btn-outline-primary btn-sm" :for="`weekday-${day.value}`">{{ day.label }}</label>
      </template>
    </div>

    <div v-if="mode === 'monthly'" class="mb-2">
      <label class="form-label" for="recurrence-day-of-month">Giorno del mese</label>
      <input id="recurrence-day-of-month" v-model.number="dayOfMonth" type="number" min="1" max="31" class="form-control" />
    </div>

    <div v-if="mode === 'monthlyMultiDay'" class="mb-2">
      <label class="form-label" for="recurrence-days-of-month">Giorni del mese (es. 5, 19)</label>
      <input id="recurrence-days-of-month" v-model="daysOfMonthText" type="text" class="form-control" placeholder="5, 19" />
    </div>
  </div>
</template>
