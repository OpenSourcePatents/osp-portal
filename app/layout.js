import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata = {
  title: 'O.S.P. — OpenSourcePatents',
  description: 'No royalty or charge. Ever. Open source patents and civic intelligence tools for public accountability.',
  openGraph: {
    title: 'O.S.P. — OpenSourcePatents',
    description: 'No royalty or charge. Ever. Open source patents and civic intelligence tools.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
