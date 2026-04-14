export default function PublicFooter() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-black px-6 py-4 flex items-center justify-between text-sm text-zinc-500">

      <p>© 2024 AutoSchedule Pro. Todos os direitos reservados.</p>

      <div className="flex gap-6">
        <button className="hover:text-white transition">
          Termos de Uso
        </button>
        <button className="hover:text-white transition">
          Política de Privacidade
        </button>
      </div>

    </footer>
  )
}