type SplitLayoutProps = {
  htmlContent: string
}

export function SplitLayout({ htmlContent }: SplitLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-10 md:py-12">
      <div
        className="markdown-body text-zinc-800 dark:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}
