import sidebarNavigation from "@/constants/sidebar.json"
import type {
  NavigationPageData,
  SidebarCategoryData,
} from "@/types/navigation"

export type SidebarNavigationJson = {
  home: NavigationPageData
  categories: Array<{
    title: string
    topics: Record<string, string | { path: string; layout?: string }>
  }>
}

const navigation = sidebarNavigation as unknown as SidebarNavigationJson

export function parseSidebarJson(nav: SidebarNavigationJson) {
  const homePage = nav.home
  const sidebarCategories: SidebarCategoryData[] = nav.categories.map((category, index) => {
    const items = Object.entries(category.topics).map(([label, value]) => {
      let path = ""
      let layout: string | undefined = undefined

      if (typeof value === "string") {
        path = value
      } else {
        path = value.path
        layout = value.layout
      }

      const slug = path.split("/")[2] ?? label.toLowerCase().replace(/\s+/g, "-")
      return { label, path, slug, layout }
    })

    // Treat the home page like a regular sidebar item under the first category.
    if (index === 0 && !items.some((item) => item.path === homePage.path)) {
      items.unshift({
        label: homePage.label,
        path: homePage.path,
        slug: "home",
        layout: undefined,
      })
    }

    return {
      title: category.title,
      items,
    }
  })
  const sidebarItems = sidebarCategories.flatMap((category) => category.items)

  return {
    homePage,
    sidebarCategories,
    sidebarItems,
  }
}

const parsedDefault = parseSidebarJson(navigation)

export const homePage = parsedDefault.homePage
export const sidebarCategories = parsedDefault.sidebarCategories
export const sidebarItems = parsedDefault.sidebarItems

export function getSidebarItemByPath(path: string) {
  return sidebarItems.find((item) => item.path === path)
}

export function getSidebarItemBySlug(slug: string) {
  return sidebarItems.find((item) => item.slug === slug)
}
