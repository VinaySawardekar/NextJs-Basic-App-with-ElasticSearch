import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AuthProvider from '@/components/AuthProvider/AuthProvider'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from "react";
import Loader from "./loading";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Claim Verification',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>

          <div className="container">
            <Navbar />
              <Suspense fallback={<Loader />}>
                {children}
              </Suspense> 
            <Footer />
          </div>
        </AuthProvider>
        </body>
    </html>
  )
}
