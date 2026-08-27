import { SidebarItem } from "@/components/layout/SidebarItem"
import type { SidebarCategoryData } from "@/types/navigation"

type SidebarCategoryProps = {
  category: SidebarCategoryData
  activePath: string
  onSelectItem: (path: string) => void
}

export function SidebarCategory({
  category,
  activePath,
  onSelectItem,
}: SidebarCategoryProps) {
  return (
    <section className="space-y-1.5">
      <div className="flex h-8 w-full items-center justify-between px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        <span>{category.title}</span>
      </div>

      <div className="space-y-1 pl-2">
        {category.items.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={activePath === item.path}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </section>
  )
}
