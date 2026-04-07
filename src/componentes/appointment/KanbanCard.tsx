import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

import type Appointment from "../../models/Appointment"

interface Props {
  appointment: Appointment
}

export default function KanbanCard({ appointment }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: appointment.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getInitials = (name?: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const clientName = appointment.client?.name || "Cliente"
  const serviceName = appointment.service_name || "Serviço"

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-zinc-950 border border-zinc-800 rounded-xl p-3 transition
        ${isDragging ? "opacity-50 shadow-lg" : "hover:border-yellow-500"}
      `}
    >
      <div className="flex gap-3">

        {/* DRAG ICON */}
        <div className="text-zinc-500">
          <GripVertical size={18} />
        </div>

        <div className="flex-1">

          {/* HEADER */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs">
              {getInitials(clientName)}
            </div>

            <div>
              <p className="text-sm font-medium">
                {clientName}
              </p>

              <p className="text-xs text-zinc-400">
                {serviceName}
              </p>
            </div>
          </div>

          {/* DATA */}
          <p className="text-xs text-zinc-500 mb-2">
            {appointment.date} • {appointment.start_time}
          </p>

          {/* VEÍCULO + VALOR */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">
              {appointment.client?.vehicle_plate || ""}
            </span>

            <span className="text-yellow-500 font-semibold">
              R$ {appointment.service_price}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}