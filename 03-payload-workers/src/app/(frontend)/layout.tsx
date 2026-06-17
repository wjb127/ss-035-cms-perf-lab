import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Payload + Cloudflare Workers로 만든 엣지 CMS 랜딩페이지 데모.',
  title: 'CMS Perf Lab · Payload on Cloudflare',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ko">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
