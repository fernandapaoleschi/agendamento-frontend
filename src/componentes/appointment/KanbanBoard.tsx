import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useState } from "react"

import type Appointment from "../../models/Appointment"
import KanbanColumn from "./KanbanColumn"
import KanbanCard from "./KanbanCard"

const COLUMNS = [
  { id: "scheduled", label: "Agendados",      dot: "bg-yellow-400" },
  { id: "completed", label: "Concluídos",     dot: "bg-green-400"  },
  { id: "cancelled", label: "Cancelados",     dot: "bg-red-500"    },
  { id: "no_show",   label: "Não Compareceu", dot: "bg-zinc-400"   },
]

const VALID_STATUSES = COLUMNS.map((c) => c.id)

interface Props {
  appointments: Appointment[]
  onStatusChange: (id: number, status: string) => void
}

export default function KanbanBoard({ appointments, onStatusChange }: Props) {
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const findColumnOfAppointment = (id: number) =>
    appointments.find((a) => a.id === id)?.status ?? null

  const handleDragStart = (event: any) => {
    const found = appointments.find((a) => a.id === Number(event.active.id))
    setActiveAppointment(found ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveAppointment(null)
    const { active, over } = event
    if (!over) return

    const appointmentId = Number(active.id)
    const overId = String(over.id)
    const currentColumn = findColumnOfAppointment(appointmentId)

    // soltou direto numa coluna
    if (VALID_STATUSES.includes(overId)) {
      if (overId !== currentColumn) {
        onStatusChange(appointmentId, overId)
      }
      return
    }

    // soltou em cima de um card — pega a coluna desse card
    const targetColumn = findColumnOfAppointment(Number(overId))
    if (targetColumn && targetColumn !== currentColumn) {
      onStatusChange(appointmentId, targetColumn)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const items = appointments.filter((a) => a.status === col.id)

          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.label}
              color={col.dot}
              count={items.length}
            >
              <SortableContext
                items={items.map((a) => a.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((a) => (
                  <KanbanCard key={a.id} appointment={a} />
                ))}
              </SortableContext>
            </KanbanColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeAppointment && (
          <div className="opacity-90 rotate-1 scale-105">
            <KanbanCard appointment={activeAppointment} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}