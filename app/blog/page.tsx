import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <section>
      <article className="prose">
        <h1>Blog</h1>
        <p>
          I write about the things I&rsquo;m building, learning, and exploring.
        </p>
      </article>
      <div className="mt-10">
        <BlogPosts />
      </div>
    </section>
  )
}
