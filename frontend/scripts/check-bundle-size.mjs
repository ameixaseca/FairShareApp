import { gzipSync } from 'node:zlib'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const candidateAssetsDirs = [
  join(process.cwd(), 'dist', 'assets'),
  join(process.cwd(), '..', 'backend', 'src', 'Interface', 'Api', 'wwwroot', 'assets'),
]

const assetsDir = candidateAssetsDirs.find((path) => existsSync(path))
const limitKb = 500

if (!assetsDir) {
  console.error('Could not find build assets directory. Run npm run build first.')
  process.exit(1)
}

const files = readdirSync(assetsDir)
  .map((name) => join(assetsDir, name))
  .filter((filePath) => statSync(filePath).isFile())
  .filter((filePath) => filePath.endsWith('.js') || filePath.endsWith('.css'))

const totalGzipBytes = files.reduce((total, filePath) => {
  const file = readFileSync(filePath)
  return total + gzipSync(file).byteLength
}, 0)

const totalGzipKb = totalGzipBytes / 1024
console.log(`Bundle gzip total: ${totalGzipKb.toFixed(2)} KB`)

if (totalGzipKb > limitKb) {
  console.error(`Bundle size exceeds ${limitKb} KB threshold.`)
  process.exit(1)
}
