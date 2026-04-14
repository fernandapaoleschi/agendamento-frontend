import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "./pages/auth/LoginPage"
import DashboardLayout from "./componentes/dashboardLayout/DashboardLayout"

// 🔒 ADMIN
import Dashboard from "./pages/dashboard/Dashboard"
import Agendamento from "./pages/dashboard/Agendamento"
import Clientes from "./pages/dashboard/Clientes"
import Servicos from "./pages/dashboard/Servicos"
import Profissionais from "./pages/dashboard/Profissionais"
import Usuarios from "./pages/dashboard/Usuarios"
import Logs from "./pages/dashboard/Logs"

// 🔓 PÚBLICO
import AgendamentoPage from "./pages/public/AgendamentoPage"

import "./index.css"

// ─── Private Route ─────────────────────────────────────────

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// ─── App ──────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PÚBLICO */}
        <Route path="/agendar" element={<AgendamentoPage />} />

        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 PRIVADO */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agendamentos" element={<Agendamento />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="profissionais" element={<Profissionais />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/agendar" replace />} />

      </Routes>
    </BrowserRouter>
  )
}