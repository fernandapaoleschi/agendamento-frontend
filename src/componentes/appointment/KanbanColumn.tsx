import { useDroppable } from "@dnd-kit/core"

interface Props {
  id: string
  title: string
  color: string
  count: number
  children: React.ReactNode
}

export default function KanbanColumn({
  id,
  title,
  color,
  count,
  children,
}: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border min-h-[500px] transition-all
        bg-zinc-900 border-zinc-800
        ${isOver ? "border-yellow-500 ring-2 ring-yellow-500/20" : ""}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold text-white">{title}</h3>
        </div>

        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs text-white">
          {count}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          {children}
        </div>

        {count === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-zinc-500">
            Nenhum agendamento
          </div>
        )}
      </div>
    </div>
  )
}