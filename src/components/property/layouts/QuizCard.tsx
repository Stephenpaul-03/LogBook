import { useState } from "react"
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizData } from "@/lib/markdown-parser"

type QuizCardProps = {
  quiz: QuizData
}

export function QuizCard({ quiz }: QuizCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selectedIdx === quiz.correctIndex

  function handleSubmit() {
    if (selectedIdx !== null) {
      setSubmitted(true)
    }
  }

  function handleReset() {
    setSelectedIdx(null)
    setSubmitted(false)
  }

  return (
    <div className="mt-12 rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-xl backdrop-blur-md max-w-3xl">
      <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.05]">
        <div className="flex size-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 dark:bg-white/[0.06] dark:text-zinc-50">
          <HelpCircle className="size-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Concept Check</h3>
          <p className="text-[10px] text-zinc-500">Test your understanding of the lesson above.</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
          {quiz.question}
        </p>
      </div>

      {/* Options List */}
      <div className="mt-5 space-y-2.5">
        {quiz.options.map((option, idx) => {
          const isSelected = selectedIdx === idx
          const isCurrentCorrect = idx === quiz.correctIndex

          let optionStyle = "border-white/[0.06] text-zinc-400 bg-white/[0.01] hover:bg-white/[0.04]"
          if (isSelected) {
            optionStyle = "border-zinc-800 bg-zinc-950 text-zinc-50 dark:border-white/20 dark:bg-white/10"
          }
          if (submitted) {
            if (isCurrentCorrect) {
              optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            } else if (isSelected) {
              optionStyle = "border-rose-500 bg-rose-500/10 text-rose-400"
            } else {
              optionStyle = "border-white/[0.04] text-zinc-600 bg-transparent opacity-50"
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-xs font-medium transition-all duration-200 text-left disabled:pointer-events-none",
                optionStyle
              )}
            >
              <span>{option}</span>
              {submitted && isCurrentCorrect && <CheckCircle2 className="size-4 text-emerald-500" />}
              {submitted && isSelected && !isCorrect && <AlertCircle className="size-4 text-rose-500" />}
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between gap-4">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedIdx === null}
            className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-50 hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:pointer-events-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-white/[0.08] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Explanation */}
      {submitted && quiz.explanation && (
        <div className="mt-5 rounded-lg bg-white/[0.02] border border-white/[0.04] p-4 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
          <p className="font-semibold text-zinc-300 mb-1">
            {isCorrect ? "Correct!" : "Incorrect."}
          </p>
          <p>{quiz.explanation}</p>
        </div>
      )}
    </div>
  )
}
