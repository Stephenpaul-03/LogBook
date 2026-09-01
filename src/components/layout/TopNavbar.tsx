import { ChevronDown, MessageCircle, PanelLeft, PanelLeftClose } from "lucide-react"

import { ModeToggle } from "@/components/theme/mode-toggle"
import { Button } from "@/components/ui/button"
import { PROJECTS, type Project } from "@/constants/projects"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TopNavbarProps = {
  activeProject: Project
  onSelectProject: (project: Project, event: React.MouseEvent) => void
  onOpenContact: () => void
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function TopNavbar({
  activeProject,
  onSelectProject,
  onOpenContact,
  isSidebarCollapsed,
  onToggleSidebar,
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#07080b]/78">
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex items-center px-5">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:bg-white/[0.1] dark:hover:text-zinc-100"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-16">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="pointer-events-auto flex items-center gap-1 rounded-md px-2 py-1 text-left focus:outline-none hover:opacity-80 transition-opacity cursor-pointer">
                <p className="truncate text-center text-[15px] font-semibold leading-none text-zinc-950 dark:text-zinc-50">
                  {activeProject.label}
                </p>
                <ChevronDown className="size-3.5 shrink-0 text-zinc-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="min-w-56 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-xs text-zinc-500">
                Projects
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {PROJECTS.map((proj) => (
                <DropdownMenuItem
                  key={proj.id}
                  onClick={(e) => onSelectProject(proj, e)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>{proj.label}</span>
                  {proj.id === activeProject.id && (
                    <span className="text-xs text-zinc-500">Active</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-end gap-2 px-5">
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenContact}
            aria-label="Contact Stephen"
            title="Contact Stephen"
            className="border-zinc-200 bg-white text-zinc-700 shadow-none hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-zinc-300 dark:hover:bg-white/[0.075] dark:hover:text-zinc-100 cursor-pointer"
          >
            <MessageCircle className="size-4" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
