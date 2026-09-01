import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { marked } from "marked"
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
import { parseMarkdown, type QuizData } from "@/lib/markdown-parser"
import { sitePath } from "@/lib/site-path"
import { QuizCard } from "@/components/property/layouts/QuizCard"

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
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onActiveSectionChange(undefined)
    setHtmlContent(null)
    setQuizData(null)
    setLoading(true)

    const categorySegment = parentLabel ? parentLabel : ""
    const slugSegment = currentPage.slug ? currentPage.slug : "home"
    const base = sitePath(`/content/${activeProject.id}/${categorySegment ? categorySegment + "/" : ""}`)

    async function fetchContent() {
      if (currentPage.resolvedUrl) {
        const res = await fetch(currentPage.resolvedUrl)
        const contentType = res.headers.get("content-type") || ""
        if (res.ok && !contentType.includes("text/html")) {
          return res.text()
        }
      }

      // Fallback candidate check
      const candidates = [
        `${slugSegment}.md`,
        ...Array.from({ length: 15 }, (_, i) => `${String(i + 1).padStart(2, "0")}-${slugSegment}.md`),
        ...Array.from({ length: 15 }, (_, i) => `${i + 1}-${slugSegment}.md`)
      ]

      for (const candidate of candidates) {
        const url = `${base}${candidate}`
        try {
          const res = await fetch(url)
          const contentType = res.headers.get("content-type") || ""
          if (res.ok && !contentType.includes("text/html")) {
            return res.text()
          }
        } catch {
          // ignore
        }
      }
      throw new Error("MD file not found")
    }

    fetchContent()
      .then((text) => {
        const { content: markdownBody, quiz } = parseMarkdown(text)
        setQuizData(quiz)

        const headingsList = markdownBody
          .split("\n")
          .filter((line) => line.startsWith("## "))
          .map((line) => line.replace("## ", "").trim())
        onHeadingsLoaded?.(headingsList)

        const renderer = new marked.Renderer()
        
        // 1. Heading Renderer (Scroll Sync IDs)
        renderer.heading = function (arg1: any, arg2?: any) {
          let textVal = ""
          let depthVal = 2
          if (typeof arg1 === "object" && arg1 !== null) {
            textVal = arg1.text || ""
            depthVal = arg1.depth || 2
          } else {
            textVal = arg1
            depthVal = arg2 || 2
          }

          if (depthVal === 2) {
            const id = textVal.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
            return `<h2 id="${id}" class="scroll-mt-24">${textVal}</h2>\n`
          }
          return `<h${depthVal}>${textVal}</h${depthVal}>\n`
        }

        // 2. Code Renderer (PrismJS Syntax Highlighting)
        renderer.code = function (arg1: any, arg2?: any) {
          let codeText = ""
          let lang = ""
          if (typeof arg1 === "object" && arg1 !== null) {
            codeText = arg1.text || ""
            lang = arg1.lang || ""
          } else {
            codeText = arg1
            lang = arg2 || ""
          }

          let highlighted = codeText
          if (lang && Prism.languages[lang]) {
            try {
              highlighted = Prism.highlight(codeText, Prism.languages[lang], lang)
            } catch (e) {
              console.error("Prism highlight error:", e)
            }
          }
          return `<pre><code class="language-${lang}">${highlighted}</code></pre>\n`
        }

        const parsed = marked.parse(markdownBody, { renderer })
        setHtmlContent(parsed as string)
        setLoading(false)
      })
      .catch(() => {
        onHeadingsLoaded?.([])
        setHtmlContent(null)
        setQuizData(null)
        setLoading(false)
      })
  }, [activeProject, currentPage, parentLabel, onActiveSectionChange, onHeadingsLoaded])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-zinc-500 text-sm animate-pulse">Loading content...</span>
      </div>
    )
  }

  if (htmlContent) {
    const quizNode = quizData ? <QuizCard quiz={quizData} /> : null
    return <DocumentLayout htmlContent={htmlContent} quizNode={quizNode} />
  }

  return fallback
}
