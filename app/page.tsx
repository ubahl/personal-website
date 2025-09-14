import fs from 'fs'
import path from 'path'
import { CustomMDX } from 'app/components/mdx'

export default function Page() {
  const mdxPath = path.join(process.cwd(), 'app', 'home', 'content.mdx')
  const source = fs.readFileSync(mdxPath, 'utf-8')

  return (
    <section>
      <article className="prose">
        <CustomMDX source={source} />
      </article>
    </section>
  )
}
