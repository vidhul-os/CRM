import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import KanbanCard from './KanbanCard'
import { Plus } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function KanbanBoard({ 
  columns = [], 
  cards = [], 
  onCardClick,
  onDragEnd,
  onAddClick
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return
    const { draggableId, destination } = result
    onDragEnd?.(draggableId, destination.droppableId)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full scrollbar-hide">
        {columns.map((column) => (
          <div key={column} className="min-w-[320px] max-w-[350px] flex-1 flex flex-col h-full rounded-2xl bg-surface/80 border border-border shadow-inner p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-sidebar uppercase tracking-wider">{column}</span>
                <span className="bg-card px-2.5 py-1 rounded-full border border-border text-[10px] font-bold text-muted shadow-sm select-none">
                  {cards.filter(c => c.status === column).length}
                </span>
              </div>
              <button 
                onClick={() => onAddClick?.(column)}
                className="p-1.5 text-muted hover:text-sidebar hover:bg-card rounded-lg transition-colors border border-transparent hover:border-border"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Column Scrollable Area */}
            <Droppable droppableId={column}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={clsx(
                    "flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar min-h-[150px] transition-colors rounded-xl",
                    snapshot.isDraggingOver && "bg-primary/5"
                  )}
                >
                  {cards.filter(c => c.status === column).length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl bg-white/20 text-center">
                      <p className="text-[11px] font-semibold text-muted uppercase tracking-wider opacity-40">No {column}</p>
                    </div>
                  ) : (
                    cards
                      .filter(c => c.status === column)
                      .map((card, index) => (
                        <KanbanCard 
                          key={String(card._id || card.id)} 
                          card={card} 
                          index={index}
                          onClick={onCardClick} 
                        />
                      ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
