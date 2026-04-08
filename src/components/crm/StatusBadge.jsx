const STATUS_MAP = {
  'New':         'bg-blue-100   text-blue-700   border-blue-200',
  'Contacted':   'bg-purple-100 text-purple-700 border-purple-200',
  'Qualified':   'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Proposal':    'bg-orange-100 text-orange-700 border-orange-200',
  'Won':         'bg-green-100  text-green-700  border-green-200',
  'Lost':        'bg-red-100    text-red-700    border-red-200',
  'Demo':        'bg-cyan-100   text-cyan-700   border-cyan-200',
  'Negotiation': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Closed Won':  'bg-green-100  text-green-700  border-green-200',
  'Closed Lost': 'bg-red-100    text-red-700    border-red-200',
}

export default function StatusBadge({ status }) {
  const cls = STATUS_MAP[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
  
  return (
    <span className={'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border transition-colors ' + cls}>
      {status}
    </span>
  )
}
