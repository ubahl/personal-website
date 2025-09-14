#!/usr/bin/env node
/*
  Optimize images under public/images.
  - Resize to a max width (default 1600px)
  - Re-encode JPEG quality (default 80)
  - PNGs with alpha: keep PNG (lossless-ish). PNGs without alpha can be converted to JPEG if --convertPng is true.
  - Optionally update MDX references if extensions change (e.g., .png -> .jpg)
*/
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = {
    dir: 'public/images',
    maxWidth: 1600,
    quality: 80,
    convertPng: true,
    updateMdx: true,
    deleteOriginal: true,
  }
  for (let i = 0; i < args.length; i++) {
    let [k, v] = args[i].split('=')
    if (k === '--dir' && v) opts.dir = v
    if (k === '--maxWidth' && v) opts.maxWidth = parseInt(v, 10)
    if (k === '--quality' && v) opts.quality = parseInt(v, 10)
    if (k === '--convertPng' && v) opts.convertPng = v === 'true'
    if (k === '--updateMdx' && v) opts.updateMdx = v === 'true'
    if (k === '--deleteOriginal' && v) opts.deleteOriginal = v === 'true'
  }
  return opts
}

function walk(dir) {
  let out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out = out.concat(walk(p))
    else out.push(p)
  }
  return out
}

async function processImage(file, opts, mdxChanges) {
  const ext = path.extname(file)
  const base = path.basename(file, ext)
  const dir = path.dirname(file)
  const lowerExt = ext.toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(lowerExt)) return { skipped: true }

  const img = sharp(file)
  const meta = await img.metadata()
  const beforeSize = fs.statSync(file).size

  const needsResize = (meta.width || 0) > opts.maxWidth
  const isPng = lowerExt === '.png'
  const hasAlpha = !!meta.hasAlpha

  let targetPath = file
  let pipeline = img
  if (needsResize) pipeline = pipeline.resize({ width: opts.maxWidth, withoutEnlargement: true })

  if (isPng) {
    if (!hasAlpha && opts.convertPng) {
      // Convert to JPEG
      targetPath = path.join(dir, `${base}.jpg`)
      pipeline = pipeline.jpeg({ quality: opts.quality, mozjpeg: true })
    } else {
      // Keep PNG, try to compress
      pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true })
    }
  } else {
    // JPEG/JPG
    pipeline = pipeline.jpeg({ quality: opts.quality, mozjpeg: true })
  }

  // If writing to the same path, write to a temp file then replace to avoid sharp overwrite issues
  if (targetPath === file) {
    const tmpPath = path.join(dir, `${base}.opt${lowerExt}`)
    await pipeline.toFile(tmpPath)
    fs.renameSync(tmpPath, targetPath)
  } else {
    await pipeline.toFile(targetPath)
  }

  const afterSize = fs.statSync(targetPath).size

  // Delete original if we changed the target path (e.g., PNG -> JPG) and deletion is enabled
  if (targetPath !== file && opts.deleteOriginal) {
    try {
      fs.unlinkSync(file)
    } catch (_) {
      // ignore
    }
  }

  if (targetPath !== file && opts.updateMdx) {
    // Update MDX references from old path to new path
    const from = path.join('/' + path.relative('public', file)).replace(/\\/g, '/')
    const to = path.join('/' + path.relative('public', targetPath)).replace(/\\/g, '/')
    mdxChanges.push({ from, to })
  }

  return {
    file,
    targetPath,
    beforeMB: (beforeSize / (1024 * 1024)).toFixed(2),
    afterMB: (afterSize / (1024 * 1024)).toFixed(2),
  }
}

function updateMdxReferences(changes) {
  const mdxDir = path.join(process.cwd(), 'app', 'blog', 'posts')
  if (!fs.existsSync(mdxDir)) return
  const files = fs.readdirSync(mdxDir).filter((f) => f.endsWith('.mdx'))
  for (const f of files) {
    const p = path.join(mdxDir, f)
    let src = fs.readFileSync(p, 'utf-8')
    let replaced = src
    for (const c of changes) {
      replaced = replaced.split(c.from).join(c.to)
    }
    if (replaced !== src) {
      fs.writeFileSync(p, replaced, 'utf-8')
      console.log('Updated MDX refs in', p)
    }
  }
}

async function main() {
  const opts = parseArgs()
  const root = path.join(process.cwd(), opts.dir)
  if (!fs.existsSync(root)) {
    console.error('Directory not found:', root)
    process.exit(1)
  }
  const files = walk(root)
  const mdxChanges = []
  const results = []
  for (const f of files) {
    try {
      const r = await processImage(f, opts, mdxChanges)
      if (!r.skipped) results.push(r)
    } catch (e) {
      // Non-image files or unsupported formats will throw; ignore
    }
  }

  if (opts.updateMdx && mdxChanges.length) updateMdxReferences(mdxChanges)

  // Log summary
  for (const r of results) {
    const from = '/' + path.relative(process.cwd(), r.file)
    const to = '/' + path.relative(process.cwd(), r.targetPath)
    const note = r.file === r.targetPath ? '' : ` -> ${to}`
    console.log(`${from}: ${r.beforeMB}MB -> ${r.afterMB}MB${note}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
