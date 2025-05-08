import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '比亚迪汽车 - 2024年销量数据分析',
  description: '比亚迪汽车2024年第一季度销量排行榜及数据分析，展示热销车型排名、销量趋势及市场表现',
  icons: {
    icon: '/byd-logo.png',
    apple: '/byd-logo.png',
  },
  themeColor: '#0a1229',
  openGraph: {
    title: '比亚迪汽车 - 2024年销量数据分析',
    description: '比亚迪汽车2024年第一季度销量排行榜及数据分析，展示热销车型排名、销量趋势及市场表现',
    type: 'website',
    images: ['/byd-logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=SF+Pro+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark text-white overflow-x-hidden min-h-screen relative">
        {children}
      </body>
    </html>
  )
} 