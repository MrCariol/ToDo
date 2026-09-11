import { parseISO, format, differenceInCalendarDays } from 'date-fns'
import type { ISODate, ISODateTime } from '../models/Task'

const DATE_FORMAT = 'yyyy-MM-dd'

export function todayISODate(): ISODate {
  return format(new Date(), DATE_FORMAT)
}

export function nowISODateTime(): ISODateTime {
  return new Date().toISOString()
}

export function toISODate(date: Date): ISODate {
  return format(date, DATE_FORMAT)
}

export function parseISODate(iso: ISODate | ISODateTime): Date {
  return parseISO(iso)
}

/** Giorni di calendario tra oggi e isoDate (positivo se isoDate è futura) */
export function daysFromToday(isoDate: ISODate): number {
  return differenceInCalendarDays(parseISODate(isoDate), new Date())
}

/** Giorni di calendario trascorsi da isoDateTime ad oggi */
export function daysSince(isoDateTime: ISODateTime): number {
  return differenceInCalendarDays(new Date(), parseISODate(isoDateTime))
}
