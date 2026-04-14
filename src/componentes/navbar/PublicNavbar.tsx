export default function PublicNavbar() {
  return (
    <header className="w-full border-b border-zinc-800 bg-black px-6 py-4 flex items-center justify-between">

      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-black font-bold">
          🛡️
        </div>

        <div>
          <p className="font-semibold text-white">AutoSchedule Pro</p>
          <p className="text-xs text-zinc-400">Agendamento Premium</p>
        </div>
      </div>

      {/* SUPORTE */}
      <p className="text-sm text-zinc-400">
        Precisa de ajuda?{" "}
        <span className="text-yellow-500 font-medium">(11) 99999-9999</span>
      </p>

    </header>
  )
}