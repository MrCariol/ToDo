export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'monthlyMultiDay'

/**
 * interval è ignorato per monthlyMultiDay (le date sono esplicite in daysOfMonth).
 * daysOfWeek: 0=domenica..6=sabato (convenzione date-fns getDay).
 */
export interface RecurrenceRule {
  type: RecurrenceType
  interval: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  daysOfMonth?: number[]
}
