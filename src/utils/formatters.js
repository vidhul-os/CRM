import { format, parseISO, formatDistanceToNow } from 'date-fns'

export const fmtDate   = (d) => { try { return format(parseISO(d), 'dd MMM yyyy') } catch { return d ?? '—' } }
export const fmtDateTime = (d) => { try { return format(parseISO(d), 'dd MMM yyyy, h:mm a') } catch { return d ?? '—' } }
export const fmtRelative = (d) => { try { return formatDistanceToNow(parseISO(d), { addSuffix: true }) } catch { return '—' } }
export const fmtCurrency = (v, symbol = '₹') => `${symbol}${Number(v ?? 0).toLocaleString('en-IN')}`
export const initials = (name = '') => name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || '?'
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`
