export interface Frontmatter {
  layout?: string
  title?: string
  mdn?: string
  [key: string]: any
}

export interface QuizData {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter
  content: string
  quiz: QuizData | null
}

export function parseMarkdown(rawContent: string): ParsedMarkdown {
  let frontmatter: Frontmatter = {}
  let content = rawContent
  let quiz: QuizData | null = null

  // 1. Parse Frontmatter (--- ... ---)
  const frontmatterRegex = /^---([\s\S]*?)---/
  const fmMatch = rawContent.match(frontmatterRegex)
  if (fmMatch) {
    const fmText = fmMatch[1]
    content = content.replace(frontmatterRegex, "").trim()

    // Parse simple key-value YAML
    const lines = fmText.split("\n")
    for (const line of lines) {
      const parts = line.split(":")
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const value = parts.slice(1).join(":").trim()
        frontmatter[key] = value
      }
    }
  }

  // 2. Parse Quiz Block (:::quiz ... :::)
  const quizRegex = /:::quiz([\s\S]*?):::/
  const quizMatch = content.match(quizRegex)
  if (quizMatch) {
    const quizText = quizMatch[1]
    content = content.replace(quizRegex, "").trim()

    // Parse quiz fields
    let question = ""
    let options: string[] = []
    let correctIndex = 0
    let explanation = ""

    const quizLines = quizText.split("\n")
    let currentField: "none" | "question" | "options" | "explanation" = "none"

    for (const line of quizLines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      if (trimmed.startsWith("question:")) {
        question = trimmed.replace("question:", "").trim()
        currentField = "question"
      } else if (trimmed.startsWith("options:")) {
        currentField = "options"
      } else if (trimmed.startsWith("explanation:")) {
        explanation = trimmed.replace("explanation:", "").trim()
        currentField = "explanation"
      } else if (currentField === "options" && trimmed.startsWith("-")) {
        let optionText = trimmed.substring(1).trim()
        const isCorrect = optionText.includes("(correct)")
        if (isCorrect) {
          optionText = optionText.replace("(correct)", "").trim()
          correctIndex = options.length
        }
        options.push(optionText)
      } else if (currentField === "question") {
        question += " " + trimmed
      } else if (currentField === "explanation") {
        explanation += " " + trimmed
      }
    }

    if (question && options.length > 0) {
      quiz = {
        question,
        options,
        correctIndex,
        explanation: explanation || undefined,
      }
    }
  }

  return {
    frontmatter,
    content,
    quiz,
  }
}
