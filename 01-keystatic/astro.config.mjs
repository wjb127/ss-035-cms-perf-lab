import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'

// KEYSTATIC=1 (dev)일 때만 admin/api 라우트(SSR) 주입 → 프로덕션 build는 순수 정적(어댑터 불필요)
const withKeystatic = process.env.KEYSTATIC === '1'

export default defineConfig({
  integrations: withKeystatic ? [react(), keystatic()] : [],
})
