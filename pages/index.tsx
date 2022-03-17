import dbConnect from '@/lib/db/mongodb'
import User from 'models/User'
import type { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useState } from 'react'

const Home: NextPage = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated' || !session) {
    return <>{signIn()}</>
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/otro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    console.log(data)
  }

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Init</h1>
      <p>
        <code>{JSON.stringify(session, null, 2)}</code>
      </p>
      {session ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn('credentials')}>Sign In</button>
      )}
      <h2>Añadir Otro</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          description
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <button type="submit">Añadir</button>
      </form>
    </>
  )
}

export default Home
