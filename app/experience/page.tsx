import fs from 'fs'
import path from 'path'
import { CustomMDX } from 'app/components/mdx'

export const metadata = {
  title: 'Experience',
  description: 'Work experience, education, and achievements.',
}

export default function ExperiencePage() {
  const mdxPath = path.join(process.cwd(), 'app', 'experience', 'content.mdx')
  const source = fs.readFileSync(mdxPath, 'utf-8')

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Experience</h1>
      <article className="prose">
        <CustomMDX source={source} />
      </article>
    </section>
  )
}
