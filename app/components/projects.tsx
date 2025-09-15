import Link from 'next/link'
import type { ReactNode } from 'react'

type ProjectProps = {
  title: string
  description: string
  href?: string
  tags?: string[]
}

function isExternal(href: string) {
  return href.startsWith('http') || href.startsWith('mailto:')
}

export function Projects({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose grid gap-6 sm:grid-cols-2">
      {children}
    </div>
  )
}

export function Project({ title, description, href, tags }: ProjectProps) {
  const card = (
    <div className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
        {tags && tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 !list-none !pl-0">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium tracking-tight text-zinc-600 transition group-hover:bg-zinc-900 group-hover:text-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  if (!href) {
    return card
  }

  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full !no-underline hover:!no-underline focus-visible:!no-underline"
      >
        {card}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="block h-full !no-underline hover:!no-underline focus-visible:!no-underline"
    >
      {card}
    </Link>
  )
}
