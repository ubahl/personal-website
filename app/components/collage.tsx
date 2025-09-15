import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from 'app/blog/utils'

type CollageProps = {
  limit?: number
  className?: string
}

function extractFirstImageSrc(content: string): string | null {
  // Look for Next <Image src="..." /> first
  let m = content.match(/<Image[^>]*src=["']([^"']+)["'][^>]*\/>/i)
  if (m && m[1]) return m[1]
  // Fallback: Markdown image syntax ![alt](src)
  let m2 = content.match(/!\[[^\]]*\]\(([^)]+)\)/)
  if (m2 && m2[1]) return m2[1]
  return null
}

export function BlogCollage({ limit = 6, className = '' }: CollageProps) {
  let posts = getBlogPosts()
    .sort((a, b) => (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1))
    .map((post) => {
      let src = post.metadata.image || extractFirstImageSrc(post.content)
      return src
        ? {
            slug: post.slug,
            title: post.metadata.title,
            src,
          }
        : null
    })
    .filter(Boolean)
    .slice(0, limit) as { slug: string; title: string; src: string }[]

  if (!posts.length) return null

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${className}`}>
      {posts.map(({ slug, title, src }, i) => (
        <Link
          key={slug}
          href={`/blog/${slug}`}
          className="group relative block aspect-square overflow-hidden rounded-lg"
        >
          <Image
            src={src}
            alt={title}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            priority={i < 2}
          />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] sm:text-xs md:text-sm font-medium drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1">
              {title}
            </div>
          </div>
          <span className="sr-only">{title}</span>
        </Link>
      ))}
    </div>
  )
}
