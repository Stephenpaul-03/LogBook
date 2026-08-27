import { SidebarCategory } from "@/components/layout/SidebarCategory"
import { cn } from "@/lib/utils"
import type {
  SidebarCategoryData,
} from "@/types/navigation"

type SidebarProps = {
  categories: SidebarCategoryData[]
  activePath: string
  onSelectItem: (path: string) => void
  isCollapsed: boolean
}

export function Sidebar({
  categories,
  activePath,
  onSelectItem,
  isCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "h-full shrink-0 border-r border-border bg-sidebar/95 select-none",
        // Desktop responsive transition behavior
        "md:relative md:transition-[width,opacity,border-color] md:duration-300 md:ease-in-out",
        isCollapsed
          ? "md:w-0 md:border-r-0 md:opacity-0 md:overflow-hidden max-md:-translate-x-full max-md:w-0 max-md:opacity-0 max-md:overflow-hidden"
          : "md:w-[260px] md:opacity-100 md:overflow-visible max-md:translate-x-0 max-md:w-[260px] max-md:opacity-100 max-md:overflow-visible",
        // Mobile responsive drawer positioning
        "max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:z-50 max-md:h-full max-md:shadow-2xl max-md:transition-transform max-md:duration-300 max-md:ease-in-out max-md:bg-sidebar"
      )}
    >
      <div className="flex h-full w-full flex-col justify-between">
        <nav
          aria-label="Navigation menu"
          className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 [scrollbar-color:rgb(161_161_170)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgb(63_63_70)_transparent]"
        >
          {categories.map((category) => (
            <SidebarCategory
              key={category.title}
              category={category}
              activePath={activePath}
              onSelectItem={onSelectItem}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}
