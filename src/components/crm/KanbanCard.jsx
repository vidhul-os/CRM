import { Draggable } from '@hello-pangea/dnd'
import StatusBadge from './StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function KanbanCard({ 
  card, 
  index,
  onClick, 
  className 
}) {
  const cardId = String(card._id || card.id)

  return (
    <Draggable draggableId={cardId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick?.(card)}
          style={{
            ...provided.draggableProps.style,
          }}
          className={cn(
            'group bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary cursor-pointer transition duration-300 animate-in fade-in zoom-in duration-200',
            snapshot.isDragging && 'shadow-2xl border-primary ring-2 ring-primary/10 rotate-2 scale-105 z-50',
            className
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-sm font-bold text-sidebar group-hover:text-primary transition-colors">
              {card.name}
            </h4>
            <StatusBadge status={card.status} />
          </div>
          
          <p className="text-xs text-muted mb-3 line-clamp-2 leading-relaxed">
            {card.company || card.description || 'No additional details provided.'}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex flex-col text-left">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{card.source || 'General'}</p>
              <p className="text-[11px] font-black text-sidebar mt-0.5">{card.owner?.name || 'Unassigned'}</p>
            </div>
            <Avatar name={card.owner?.name} src={card.owner?.avatar} size="sm" />
          </div>
        </div>
      )}
    </Draggable>
  )
}
