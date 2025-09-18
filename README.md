# Uma Bahl – Personal Website

Personal site built with Next.js and MDX featuring a blog, curated projects, and experiments. It tracks posts, talks, and other updates while staying lightweight and fast.

## Tech Stack

- Next.js 15 (App Router) with React 19
- TypeScript + Tailwind CSS v4
- MDX content for home, blog, and projects
- Vercel Analytics & Speed Insights
- Custom components for post previews, project cards, and image collage

## Local Development

```bash
# install dependencies
pnpm install

# start the dev server
pnpm dev

# type-check
pnpm exec tsc --noEmit
```

Blog posts live in `app/blog`, project content in `app/projects/content.mdx`, and home page copy in `app/home/content.mdx`. Favicon and OG assets live under `app/icon.svg` and `public/images`.

## Deployment

The site deploys to Vercel. Pushes to `main` automatically build and deploy via the connected project. You can trigger a local build with:

```bash
pnpm build
```

Then deploy using the [Vercel CLI](https://vercel.com/docs/cli) (`vercel --prod`) or the Vercel dashboard.

## Customization Notes

- Update metadata defaults (title, OG info) in `app/layout.tsx`
- Project cards are defined in `app/components/projects.tsx`
- Posts collage component lives in `app/components/collage.tsx`
- RSS + sitemap generation handled in `app/rss` and `app/sitemap.ts`

Originally forked from the [Vercel portfolio/blog starter](https://vercel.com/templates/next.js/portfolio-starter-kit).
