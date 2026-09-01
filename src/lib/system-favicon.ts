import iconDarkUrl from "@/assets/icon-dark.ico"
import iconLightUrl from "@/assets/icon-light.ico"

const systemDarkQuery = "(prefers-color-scheme: dark)"

function setFavicon(isSystemDark: boolean) {
  const favicon = document.querySelector<HTMLLinkElement>("#system-favicon")
  if (!favicon) return

  const iconUrl = isSystemDark ? iconDarkUrl : iconLightUrl
  const systemTheme = isSystemDark ? "dark" : "light"

  favicon.type = "image/x-icon"
  favicon.href = `${iconUrl}?system-theme=${systemTheme}`
}

export function initializeSystemFavicon() {
  const systemTheme = window.matchMedia(systemDarkQuery)
  const syncFavicon = (event: MediaQueryListEvent) => setFavicon(event.matches)

  setFavicon(systemTheme.matches)
  systemTheme.addEventListener("change", syncFavicon)
}
