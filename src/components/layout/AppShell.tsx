import { useEffect, useState } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import { Monitor } from "lucide-react"

import {
  parseSidebarJson,
} from "@/constants/sidebar"
import { PROJECTS, type Project } from "@/constants/projects"
import { AppContextMenu } from "@/components/layout/AppContextMenu"
import { BreadcrumbBar } from "@/components/layout/BreadcrumbBar"
import { ContactModal } from "@/components/layout/ContactModal"
import { MainContent } from "@/components/layout/MainContent"
import { PropertyRenderer } from "@/components/property/PropertyRenderer"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopNavbar } from "@/components/layout/TopNavbar"
import type { NavigationPageData, SidebarCategoryData, SidebarItemData } from "@/types/navigation"
import { sitePath, siteRoot } from "@/lib/site-path"

const initialActivePath = "/"

function parseUrl(): { projectId: string; pagePath: string } | null {
  if (typeof window === "undefined") return null
  const pathname = window.location.pathname
  if (!pathname || pathname === "/" || pathname === siteRoot) return null

  const root = siteRoot.endsWith("/") ? siteRoot.slice(0, -1) : siteRoot
  const segment = pathname.startsWith(`${root}/`)
    ? pathname.substring(root.length + 1)
    : pathname.substring(1)
  const matchedProject = PROJECTS.find((p) =>
    segment.toLowerCase().startsWith(p.id.toLowerCase() + "-")
  )

  if (matchedProject) {
    const slug = segment.substring(matchedProject.id.length + 1)
    return { projectId: matchedProject.id, pagePath: slug }
  }
  return null
}

function getCurrentPage(
  activePath: string,
  homePage: NavigationPageData,
  sidebarCategories: SidebarCategoryData[]
) {
  for (const category of sidebarCategories) {
    const item = category.items.find((page) => page.path === activePath)

    if (item) {
      return { currentPage: item, parentLabel: category.title }
    }
  }

  if (activePath === "/" || activePath === homePage.path) {
    return { currentPage: homePage, parentLabel: undefined }
  }

  return {
    currentPage: homePage,
    parentLabel: undefined,
  }
}

export function AppShell() {
  const [activeProject, setActiveProject] = useState<Project>(() => {
    const urlInfo = parseUrl()
    if (urlInfo) {
      const proj = PROJECTS.find((p) => p.id === urlInfo.projectId)
      if (proj) return proj
    }
    return PROJECTS[0]
  })

  const [activePath, setActivePath] = useState(initialActivePath)
  const [pendingSlug, setPendingSlug] = useState<string | null>(() => {
    const urlInfo = parseUrl()
    return urlInfo ? urlInfo.pagePath : null
  })

  const [activeSectionTitle, setActiveSectionTitle] = useState<string>()

  // Collapsible States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768,
  )
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [splashCoords, setSplashCoords] = useState<{ x: number; y: number } | null>(null)

  const handleSelectPath = (path: string) => {
    setActivePath(path)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarCollapsed(true)
    }
  }

  const handleSelectProject = (
    project: Project,
    event: ReactMouseEvent,
  ) => {
    if (project.id === activeProject.id) return

    setSplashCoords({ x: event.clientX, y: event.clientY })

    window.setTimeout(() => {
      setActiveProject(project)
      setPendingSlug("home")
    }, 400)

    window.setTimeout(() => {
      setSplashCoords(null)
    }, 1000)
  }
  // System menu preference state
  const [useSystemMenu, setUseSystemMenu] = useState(() => {
    return localStorage.getItem("cascade-use-system-menu") === "true"
  })
  const handleSwitchToSystemMenu = () => {
    localStorage.setItem("cascade-use-system-menu", "true")
    setUseSystemMenu(true)
  }

  const handleRestoreCustomMenu = () => {
    localStorage.setItem("cascade-use-system-menu", "false")
    setUseSystemMenu(false)
  }

  const [navData, setNavData] = useState<{
    homePage: NavigationPageData
    sidebarCategories: SidebarCategoryData[]
    sidebarItems: SidebarItemData[]
  }>({
    homePage: { label: "About", path: "/" },
    sidebarCategories: [],
    sidebarItems: [],
  })

  // Handle browser Back/Forward navigation
  useEffect(() => {
    function handlePopState() {
      const urlInfo = parseUrl()
      if (urlInfo) {
        const proj = PROJECTS.find((p) => p.id === urlInfo.projectId)
        if (proj) {
          setActiveProject(proj)
          setPendingSlug(urlInfo.pagePath)
        }
      } else {
        setActiveProject(PROJECTS[0])
        setPendingSlug("home")
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Sync URL pushState when project or path changes
  useEffect(() => {
    let slug = "home"
    const currentItem = navData.sidebarItems.find((item) => item.path === activePath)
    if (currentItem && currentItem.slug) {
      slug = currentItem.slug
    }

    const expectedPathname = sitePath(`/${activeProject.id}-${slug}`)
    if (window.location.pathname !== expectedPathname) {
      window.history.pushState(
        { projectId: activeProject.id, pagePath: slug },
        "",
        expectedPathname
      )
    }
  }, [activeProject, activePath, navData])

  useEffect(() => {
    fetch(activeProject.sidebarUrl)
      .then((res) => res.json())
      .then(async (data) => {
        const parsed = parseSidebarJson(data)

        // Resolve home page
        let homePageResolved = parsed.homePage
        const homeCandidates = [
          sitePath(`/content/${activeProject.id}/home.md`),
          sitePath(`/content/${activeProject.id}/index.md`)
        ]
        for (const url of homeCandidates) {
          try {
            const checkRes = await fetch(url, { method: "HEAD" })
            const contentType = checkRes.headers.get("content-type") || ""
            if (checkRes.ok && !contentType.includes("text/html")) {
              homePageResolved = {
                ...parsed.homePage,
                resolvedUrl: url
              }
              break
            }
          } catch {
            // ignore
          }
        }

        // Dynamically verify if the markdown file exists for each item
        const checkedCategories = await Promise.all(
          parsed.sidebarCategories.map(async (category) => {
            const checkedItems = await Promise.all(
              category.items.map(async (item, index) => {
                const categorySegment = category.title
                const slugSegment = item.slug
                
                const twoDigitPrefix = String(index + 1).padStart(2, "0")
                const singleDigitPrefix = String(index + 1)
                
                const candidates = [
                  sitePath(`/content/${activeProject.id}/${slugSegment}.md`),
                  sitePath(`/content/${activeProject.id}/docs/${slugSegment}.md`),
                  sitePath(`/content/${activeProject.id}/${categorySegment}/${slugSegment}.md`),
                  sitePath(`/content/${activeProject.id}/${categorySegment}/${twoDigitPrefix}-${slugSegment}.md`),
                  sitePath(`/content/${activeProject.id}/${categorySegment}/${singleDigitPrefix}-${slugSegment}.md`)
                ]

                for (const url of candidates) {
                  try {
                    const checkRes = await fetch(url, { method: "HEAD" })
                    const contentType = checkRes.headers.get("content-type") || ""
                    const isHtml = contentType.includes("text/html")
                    if (checkRes.ok && !isHtml) {
                      return {
                        ...item,
                        resolvedUrl: url
                      }
                    }
                  } catch {
                    // ignore
                  }
                }
                return item
              })
            )

            return {
              ...category,
              items: checkedItems.filter((i): i is typeof i & object => i !== null),
            }
          })
        )

        const filteredCategories = checkedCategories.filter((cat) => cat.items.length > 0)
        const filteredItems = filteredCategories.flatMap((cat) => cat.items)

        // Resolve page target path using pendingSlug
        let targetPath = homePageResolved.path
        if (pendingSlug) {
          if (pendingSlug !== "home") {
            const foundItem = filteredItems.find((item) => item.slug === pendingSlug)
            if (foundItem) {
              targetPath = foundItem.path
            }
          }
          setPendingSlug(null)
        } else {
          const exists = filteredItems.some((item) => item.path === activePath)
          if (!exists) {
            targetPath = homePageResolved.path
          } else {
            targetPath = activePath
          }
        }

        setNavData({
          homePage: homePageResolved,
          sidebarCategories: filteredCategories,
          sidebarItems: filteredItems,
        })
        setActivePath(targetPath)
      })
      .catch((err) => {
        console.error("Failed to load sidebar configuration:", err)
      })
  }, [activePath, activeProject, pendingSlug])

  const { currentPage, parentLabel } = getCurrentPage(activePath, navData.homePage, navData.sidebarCategories)


  const layoutContent = (
    <div className="relative flex h-dvh w-screen flex-col overflow-hidden bg-card text-foreground antialiased">
<TopNavbar
  activeProject={activeProject}
  onSelectProject={handleSelectProject}
  onOpenContact={() => setIsContactOpen(true)}
  isSidebarCollapsed={isSidebarCollapsed}
  onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
/>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
          {!isSidebarCollapsed && (
            <div 
              className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out cursor-pointer" 
              onClick={() => setIsSidebarCollapsed(true)}
            />
          )}
          <Sidebar
            categories={navData.sidebarCategories}
            activePath={activePath}
            onSelectItem={handleSelectPath}
            isCollapsed={isSidebarCollapsed}
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-zinc-200 bg-white/86 dark:border-white/[0.08] dark:bg-[#07080b]/88">
              <div className="flex h-14 min-w-0 items-center overflow-hidden">
<BreadcrumbBar
  currentPage={currentPage}
  parentLabel={parentLabel}
  categories={navData.sidebarCategories}
  activePath={activePath}
  activeSectionTitle={activeSectionTitle}
  onSelectPath={handleSelectPath}
  activeProject={activeProject}
  onSelectProject={handleSelectProject}
  isSidebarCollapsed={isSidebarCollapsed}
  onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
/>
              </div>
            </div>
            <main className="touch-scroll-y mobile-bottom-space min-h-0 min-w-0 flex-1 overflow-y-auto bg-background [scrollbar-color:rgb(161_161_170)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgb(63_63_70)_transparent]">
              <PropertyRenderer
                onActiveSectionChange={setActiveSectionTitle}
                activeProject={activeProject}
                currentPage={currentPage}
                parentLabel={parentLabel}
                fallback={<MainContent />}
              />
            </main>
          </div>
        </div>
      </div>
      {/* Floating Restore Pill for Custom Context Menu */}
      {useSystemMenu && (
        <button
          onClick={handleRestoreCustomMenu}
          className="fixed bottom-4 right-4 z-[90] flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-zinc-50 dark:border-white/[0.08] dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <Monitor className="size-3.5 text-indigo-500" />
          Restore Custom Context Menu
        </button>
      )}
    </div>
  )

  return (
    <>
      <AppContextMenu
        currentPage={currentPage}
        categories={navData.sidebarCategories}
        onSelectPath={handleSelectPath}
        onSwitchToSystemMenu={handleSwitchToSystemMenu}
        disabled={useSystemMenu}
      >
        {layoutContent}
      </AppContextMenu>
      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
      {splashCoords && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          <div
            className="project-splash-circle"
            style={{
              left: `${splashCoords.x}px`,
              top: `${splashCoords.y}px`,
            }}
          />
        </div>
      )}
    </>
  )
}
