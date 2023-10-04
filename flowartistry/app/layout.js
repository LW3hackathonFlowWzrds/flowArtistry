import './globals.css'
import {Providers} from "./providers";


export const metadata = {
  title: 'flowArtistry',
  description: 'Mint AI generated Images on Flow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      <body class='bg-hero'>
       <Providers>
         {children}
        </Providers>
      </body>
    </html>
  )
}
