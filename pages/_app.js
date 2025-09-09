// pages/_app.js
import '@/app/globals.css'   // 👈 make sure this file exists
import { useEffect } from "react"

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

export default MyApp
