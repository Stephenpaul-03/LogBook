export interface Frontmatter {
  layout?: string
  title?: string
  mdn?: string
  [key: string]: unknown
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter
  content: string
}

export function parseMarkdown(rawContent: string): ParsedMarkdown {
  const frontmatter: Frontmatter = {}
  let content = rawContent

  const frontmatterRegex = /^---([\s\S]*?)---/
  const fmMatch = rawContent.match(frontmatterRegex)
  if (fmMatch) {
    content = content.replace(frontmatterRegex, "").trim()
    for (const line of fmMatch[1].split("\n")) {
      const separatorIndex = line.indexOf(":")
      if (separatorIndex === -1) continue
      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()
      frontmatter[key] = value
    }
  }

  return { frontmatter, content }
}
