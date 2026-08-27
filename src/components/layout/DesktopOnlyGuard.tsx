import type { ReactNode } from "react"

type DesktopOnlyGuardProps = {
  children: ReactNode
}

export function DesktopOnlyGuard({ children }: DesktopOnlyGuardProps) {
  return <>{children}</>
}
