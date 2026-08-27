import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { SidebarItemData } from "@/types/navigation"

type SidebarItemProps = {
  item: SidebarItemData
  isActive: boolean
  onSelect: (path: string) => void
  showChevron?: boolean
}

export function SidebarItem({
  item,
  isActive,
  onSelect,
  showChevron = true,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      onClick={() => onSelect(item.path)}
      className={cn(
        "group flex h-9 w-full items-center justify-between rounded-xl px-3 text-left text-sm transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-secondary text-primary font-bold shadow-sm"
          : "text-zinc-500 hover:bg-secondary/40 hover:text-primary dark:text-zinc-400 dark:hover:bg-white/[0.025] dark:hover:text-primary",
      )}
    >
      <span className="truncate text-[13px] font-medium">{item.label}</span>
      {showChevron ? (
        <ChevronRight
          className={cn(
            "size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-60",
            isActive && "opacity-80 text-primary",
          )}
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}
