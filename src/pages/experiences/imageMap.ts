// Drop images into src/assets/experiences/{experience-id}/ to activate the gallery.
// Vite resolves this glob at build time - no runtime filesystem access required.
const RAW = import.meta.glob<{ default: string }>(
  '../../assets/experiences/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
)

const EXPERIENCE_IMAGES: Record<string, string[]> = {}

for (const [path, mod] of Object.entries(RAW)) {
  const id = path.split('/').at(-2) ?? ''
  if (id) (EXPERIENCE_IMAGES[id] ??= []).push(mod.default)
}

export default EXPERIENCE_IMAGES
