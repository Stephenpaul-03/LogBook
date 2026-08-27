import { ChevronDown} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {
  NavigationPageData,
  SidebarCategoryData,
} from "@/types/navigation"
import { PROJECTS, type Project } from "@/constants/projects"

type BreadcrumbBarProps = {
  currentPage: NavigationPageData
  parentLabel?: string
  categories: SidebarCategoryData[]
  activePath: string
  activeSectionTitle?: string
  onSelectPath: (path: string) => void
  activeProject: Project
  onSelectProject: (project: Project, event: React.MouseEvent) => void
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function BreadcrumbBar({
  currentPage,
  parentLabel,
  categories,
  activePath,
  activeSectionTitle,
  onSelectPath,
  activeProject,
  onSelectProject,
}: BreadcrumbBarProps) {
  const activeCategory = categories.find(
    (category) => category.title === parentLabel,
  )
  const siblingItems = activeCategory?.items ?? []

  return (
      <Breadcrumb
        className={cn(
          "flex h-full items-center flex-1 overflow-hidden px-4",
        )}
      >
        <BreadcrumbList className="flex-nowrap flex items-center gap-1 md:gap-2 text-[11px] md:text-sm text-zinc-500 dark:text-zinc-500">
          <BreadcrumbItem className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <BreadcrumbLink asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md px-1 py-1 font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100"
                  >
                    <span>{activeProject.label}</span>
                    <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
                  </button>
                </BreadcrumbLink>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-56 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
              >
                <DropdownMenuLabel className="text-xs text-zinc-500">
                  Switch Project
                </DropdownMenuLabel>
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
          </BreadcrumbItem>

          {parentLabel ? (
            <>
              <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-700 shrink-0" />
              <BreadcrumbItem className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <BreadcrumbLink asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md px-1 py-1 text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-50 dark:hover:bg-white/[0.045] dark:hover:text-zinc-200"
                      >
                        <span>{parentLabel}</span>
                        <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
                      </button>
                    </BreadcrumbLink>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="min-w-56 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
                  >
                    <DropdownMenuLabel className="text-xs text-zinc-500">
                      Jump to category
                    </DropdownMenuLabel>
                    {categories.map((category) => {
                      const firstItem = category.items[0]

                      return (
                        <DropdownMenuItem
                          key={category.title}
                          disabled={!firstItem}
                          onClick={() =>
                            firstItem && onSelectPath(firstItem.path)
                          }
                          className="cursor-pointer"
                        >
                          <span>{category.title}</span>
                          <span className="ml-auto text-xs text-zinc-500">
                            {category.items.length}
                          </span>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            </>
          ) : null}

          <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-700 shrink-0" />
          <BreadcrumbItem className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <BreadcrumbPage className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-1 font-mono text-[11px] md:text-[13px] text-zinc-950 transition-colors duration-200 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/[0.045]">
                  <span>{currentPage.path === activePath ? currentPage.label : "Unknown"}</span>
                  <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
                </BreadcrumbPage>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-64 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
              >
                <DropdownMenuLabel className="text-xs text-zinc-500">
                  Sibling properties
                </DropdownMenuLabel>
                {siblingItems.length > 0 ? (
                  siblingItems.map((item) => (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => onSelectPath(item.path)}
                      className="cursor-pointer"
                    >
                      <span className="font-mono text-xs">{item.label}</span>
                      {item.path === activePath ? (
                        <span className="ml-auto text-xs text-zinc-500">
                          Current
                        </span>
                      ) : null}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem onClick={() => onSelectPath("/")} className="cursor-pointer">
                    Home
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>

          {activeSectionTitle ? (
            <>
              <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-700 shrink-0" />
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbPage className="rounded-md px-1.5 py-1 text-zinc-600 dark:text-zinc-400">
                  {activeSectionTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
  )
}
