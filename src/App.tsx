import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "./pages/auth/LoginPage"
import DashboardLayout from "./componentes/dashboardLayout/DashboardLayout"

// páginas
import Dashboard from "./pages/dashboard/Dashboard"
import Agendamento from "./pages/dashboard/Agendamento"
import Clientes from "./pages/dashboard/Clientes"
import Servicos from "./pages/dashboard/Servicos"
import Profissionais from "./pages/dashboard/Profissionais"
import Usuarios from "./pages/dashboard/Usuarios"
import Logs from "./pages/dashboard/Logs"
import "./index.css"

// 🔐 proteção
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* ROTAS PROTEGIDAS */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agendamentos" element={<Agendamento />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="profissionais" element={<Profissionais />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </BrowserRouter>
  )
}