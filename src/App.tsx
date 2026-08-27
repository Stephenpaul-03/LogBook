import { AppShell } from "@/components/layout/AppShell"
import { DesktopOnlyGuard } from "@/components/layout/DesktopOnlyGuard"
import { ThemeProvider } from "@/components/theme/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cascade-ui-theme">
      <DesktopOnlyGuard>
        <AppShell />
      </DesktopOnlyGuard>
    </ThemeProvider>
  )
}

export default App
