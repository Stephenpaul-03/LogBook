import { CalendarDays, Pin, ChevronRight, BookOpen, Quote, FileText, CheckSquare, Sparkles } from "lucide-react"

export function MainContent() {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const recentEntries = [
    {
      title: "LogBook Project Setup",
      desc: "Completed multi-project documentation structure and custom React pages.",
      date: "30 Jun 2026",
      tag: "Project",
      bg: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20",
    },
    {
      title: "Design System Guidelines",
      desc: "Defined colors, borders, and margins matching the physical notebook aesthetic.",
      date: "29 Jun 2026",
      tag: "Note",
      bg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
    },
    {
      title: "Vibe Alignment Notes",
      desc: "Refactored layout to include spiral binder binding and hand-drawn styling.",
      date: "28 Jun 2026",
      tag: "Vibe",
      bg: "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20",
    },
  ]

  const pinnedItems = [
    { label: "Quick Start Guide", path: "/LogBook-quick-start" },
  ]

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-8 py-10 text-foreground">
      {/* Greeting Card Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-secondary via-secondary/30 to-transparent p-8 shadow-sm">
        {/* Botanical leaf Branch SVG decoration */}
        <div className="absolute right-6 bottom-0 top-0 flex items-center pointer-events-none opacity-40 text-primary">
          <svg viewBox="0 0 100 100" className="w-28 h-28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 90 Q40 50 80 10" />
            <path d="M30 65 Q20 50 35 45 Q40 55 30 65" fill="currentColor" />
            <path d="M45 50 Q38 35 50 32 Q55 42 45 50" fill="currentColor" />
            <path d="M60 35 Q55 20 65 18 Q70 28 60 35" fill="currentColor" />
            <path d="M72 22 Q68 10 75 8 Q80 16 72 22" fill="currentColor" />
            <path d="M25 73 Q40 70 38 82 Q28 80 25 73" fill="currentColor" />
            <path d="M38 58 Q53 53 50 66 Q40 65 38 58" fill="currentColor" />
            <path d="M52 42 Q67 35 65 48 Q55 48 52 42" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-xl font-medium font-serif text-muted-foreground">{getGreeting()},</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-primary tracking-tight leading-none">
            Stephen Paul
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <CalendarDays className="size-4 text-primary" />
            <span>Today • {currentDate}</span>
          </div>

          <div className="border-t border-border pt-4 mt-6 flex items-center gap-2 text-sm text-foreground/90 font-medium">
            <Sparkles className="size-4 text-primary" />
            <span>Welcome to your personal documentation logs.</span>
          </div>
        </div>
      </section>

      {/* Recent Entries */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-foreground">Recent Log Entries</h2>
          <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
            View all entries
          </span>
        </div>

        <div className="space-y-3">
          {recentEntries.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between rounded-xl border border-border/60 bg-card p-4 transition-all hover:bg-secondary/20 shadow-sm"
            >
              <div className="flex gap-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-muted-foreground font-mono">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid: Pinned & Collections */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Pinned Links */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Pin className="size-4 text-primary" />
            Pinned Pages
          </h3>
          <div className="mt-4 space-y-2">
            {pinnedItems.map((item, idx) => (
              <a
                key={idx}
                href={item.path}
                className="flex items-center justify-between rounded-lg border border-border/40 p-3 text-xs font-medium text-foreground hover:bg-secondary/30 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="size-4 text-muted-foreground" />
                  {item.label}
                </span>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <CheckSquare className="size-4 text-primary" />
            Collections
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2.5">
              <span className="text-foreground">LogBook Documentation</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 font-bold text-[10px] text-primary">
                8 pages
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2.5">
              <span className="text-foreground">Cascade Reference Labs</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 font-bold text-[10px] text-primary">
                2 pages
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground">Custom React Components</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 font-bold text-[10px] text-primary">
                2 layouts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="mt-4 flex flex-col items-center justify-center rounded-xl border border-border/60 bg-gradient-to-r from-secondary/20 to-secondary/40 p-6 text-center shadow-sm relative overflow-hidden">
        <Quote className="size-8 text-primary opacity-15 absolute top-4 left-4" />
        <p className="text-base font-serif italic text-primary leading-relaxed">
          "A record today, clarity tomorrow."
        </p>
      </section>
    </div>
  )
}
