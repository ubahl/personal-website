import fs from 'fs'
import path from 'path'
import { CustomMDX } from 'app/components/mdx'

export const metadata = {
  title: 'Projects',
  description: 'Selected projects and links.',
}

export default function ProjectsPage() {
  const mdxPath = path.join(process.cwd(), 'app', 'projects', 'content.mdx')
  const source = fs.readFileSync(mdxPath, 'utf-8')

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Projects</h1>
      <article className="prose">
        <CustomMDX source={source} />
      </article>
    </section>
  )
}

