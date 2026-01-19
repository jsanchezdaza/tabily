import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
  className?: string
}

function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean
            className?: string
            children?: React.ReactNode
          }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`${className} bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5`}
                {...props}
              >
                {children}
              </code>
            )
          },
          h1: props => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props} />
          ),
          h2: props => (
            <h2
              className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100"
              {...props}
            />
          ),
          h3: props => (
            <h3
              className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-gray-100"
              {...props}
            />
          ),
          p: props => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
          ),
          ul: props => (
            <ul
              className="list-disc pl-5 mb-4 space-y-1 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          ol: props => (
            <ol
              className="list-decimal pl-5 mb-4 space-y-1 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          li: props => <li className="pl-1" {...props} />,
          blockquote: props => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          a: props => (
            <a
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          table: props => (
            <div className="overflow-x-auto my-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
              />
            </div>
          ),
          thead: props => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
          tbody: props => (
            <tbody
              className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
              {...props}
            />
          ),
          tr: props => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" {...props} />
          ),
          th: props => (
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              {...props}
            />
          ),
          td: props => (
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
