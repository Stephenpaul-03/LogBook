import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { LoaderCircle } from "lucide-react"
import { marked, type Tokens } from "marked"
import Prism from "prismjs"
import "prismjs/components/prism-css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-bash"
import "prismjs/themes/prism-tomorrow.css"

import type { NavigationPageData } from "@/types/navigation"
import type { Project } from "@/constants/projects"

import { DocumentLayout } from "@/components/property/layouts/DocumentLayout"
import { SplitLayout } from "@/components/property/layouts/SplitLayout"
import { parseMarkdown, type Frontmatter } from "@/lib/markdown-parser"
import { sitePath } from "@/lib/site-path"

type PropertyRendererProps = {
  onActiveSectionChange: (title?: string) => void
  activeProject: Project
  currentPage: NavigationPageData
  parentLabel?: string
  fallback: ReactNode
  onHeadingsLoaded?: (headings: string[]) => void
}

export function PropertyRenderer({
  onActiveSectionChange,
  activeProject,
  currentPage,
  parentLabel,
  fallback,
  onHeadingsLoaded,
}: PropertyRendererProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({})
  const [loading, setLoading] = useState(true)
  const pagePath = currentPage.path
  const pageSlug = currentPage.slug
  const pageLayout = currentPage.layout
  const resolvedUrl = currentPage.resolvedUrl

  useEffect(() => {
    onActiveSectionChange(undefined)
    setHtmlContent(null)
    setFrontmatter({})
    setLoading(true)

    const categorySegment = parentLabel ?? ""
    const slugSegment = pageSlug ?? "home"
    const base = sitePath(`/content/${activeProject.id}/${categorySegment ? `${categorySegment}/` : ""}`)

    async function fetchContent() {
      if (resolvedUrl) {
        const res = await fetch(resolvedUrl)
        const contentType = res.headers.get("content-type") || ""
        if (res.ok && !contentType.includes("text/html")) return res.text()
      }

      const candidates = [
        `${slugSegment}.md`,
        ...Array.from({ length: 15 }, (_, index) => `${String(index + 1).padStart(2, "0")}-${slugSegment}.md`),
        ...Array.from({ length: 15 }, (_, index) => `${index + 1}-${slugSegment}.md`),
      ]

      for (const candidate of candidates) {
        const url = `${base}${candidate}`
        try {
          const res = await fetch(url)
          const contentType = res.headers.get("content-type") || ""
          if (res.ok && !contentType.includes("text/html")) return res.text()
        } catch {
          // Keep trying the generated filename candidates.
        }
      }
      throw new Error("MD file not found")
    }

    fetchContent()
      .then((text) => {
        const { frontmatter: parsedFrontmatter, content: markdownBody } = parseMarkdown(text)
        setFrontmatter(parsedFrontmatter)

        const headingsList = markdownBody
          .split("\n")
          .filter((line) => line.startsWith("## "))
          .map((line) => line.replace("## ", "").trim())
        onHeadingsLoaded?.(headingsList)

        const renderer = new marked.Renderer()

        renderer.heading = function ({ text, depth }: Tokens.Heading) {
          if (depth === 2) {
            const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
            return `<h2 id="${id}" class="scroll-mt-24">${text}</h2>\n`
          }
          return `<h${depth}>${text}</h${depth}>\n`
        }

        renderer.code = function ({ text, lang = "" }: Tokens.Code) {
          let highlighted = text
          if (lang && Prism.languages[lang]) {
            try {
              highlighted = Prism.highlight(text, Prism.languages[lang], lang)
            } catch (error) {
              console.error("Prism highlight error:", error)
            }
          }
          return `<pre><code class="language-${lang}">${highlighted}</code></pre>\n`
        }

        renderer.image = function ({ href, title, text }: Tokens.Image) {
          const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          const titleAttribute = title ? ` title="${escape(title)}"` : ""
          return `<img class="markdown-image" src="${escape(href)}" alt="${escape(text)}"${titleAttribute} loading="lazy" />`
        }

        setHtmlContent(marked.parse(markdownBody, { renderer }) as string)
        setLoading(false)
      })
      .catch(() => {
        onHeadingsLoaded?.([])
        setHtmlContent(null)
        setFrontmatter({})
        setLoading(false)
      })
  }, [activeProject, pagePath, pageSlug, resolvedUrl, parentLabel, onActiveSectionChange, onHeadingsLoaded])

  if (loading) {
    return <div className="flex h-64 items-center justify-center" aria-label="Loading"><LoaderCircle className="size-5 animate-spin text-zinc-400" /></div>
  }

  if (htmlContent) {
    const activeLayout = typeof frontmatter.layout === "string" ? frontmatter.layout : pageLayout

    if (activeLayout === "split") {
      return <SplitLayout htmlContent={htmlContent} />
    }

    return <DocumentLayout htmlContent={htmlContent} />
  }

  return fallback
}
