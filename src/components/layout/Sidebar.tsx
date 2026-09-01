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
        "sidebar-shell h-full shrink-0 border-r border-border bg-sidebar/95 select-none",
        "md:relative md:overflow-hidden",
        "max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:z-50 max-md:h-full max-md:transform-gpu max-md:shadow-2xl max-md:bg-sidebar",
      )}
      data-collapsed={isCollapsed}
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
