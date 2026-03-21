import './globals.css'

export const metadata = {
  title: 'O.S.P. Portal — OpenSourcePatents',
  description: 'Civic Intelligence Network — Open source tools for public accountability. No royalty or charge. Ever.',
  openGraph: {
    title: 'O.S.P. Portal — OpenSourcePatents',
    description: 'Civic Intelligence Network — Open source tools for public accountability.',
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
      <body>{children}</body>
    </html>
  )
}
