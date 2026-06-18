import React from 'react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold tracking-tight text-center w-full">
          OpenFM - Open Football Manager
        </h1>
      </div>
      <div className="mt-8 text-center text-gray-400">
        <p>Welcome to the ultimate open-source football management simulation system.</p>
      </div>
    </main>
  )
}
