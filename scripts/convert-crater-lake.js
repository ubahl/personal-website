/*
  Convert the large PNG to a compressed JPEG for the blog post.
  - Resizes to max width 2000px (no upscaling)
  - JPEG quality ~80 with mozjpeg
*/
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function main() {
  const src = path.join(__dirname, '..', 'public', 'images', 'crater-lake', 'swimming_at_the_lake.png')
  const dest = path.join(__dirname, '..', 'public', 'images', 'crater-lake', 'swimming_at_the_lake.jpg')

  if (!fs.existsSync(src)) {
    console.error('Source file not found:', src)
    process.exit(1)
  }

  const before = fs.statSync(src).size
  await sharp(src)
    .resize({ width: 2000, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(dest)

  const after = fs.statSync(dest).size
  console.log('Converted to:', dest)
  console.log('Size before (PNG):', (before / (1024 * 1024)).toFixed(2), 'MB')
  console.log('Size after  (JPG):', (after / (1024 * 1024)).toFixed(2), 'MB')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

