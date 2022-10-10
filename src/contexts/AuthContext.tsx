import { createContext, useEffect, useState } from 'react'
import Router from 'next/router'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../services/config/auth/firebase'

type User = {
  name: string;
  email: string;
}

type SignInData = {
  email: string;
  password: string;
}

type SignUpData = {
  email: string;
  password: string;
}

type AuthContextType = {
  user: User;
  signUp: (data: SignUpData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)


export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  console.log(user)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  async function signUp({email, password} : SignUpData){
    await createUserWithEmailAndPassword(auth, email, password)
  }

  async function signIn({email, password} : SignInData){
    await signInWithEmailAndPassword(auth, email, password)
    Router.push('/dashboard')

  }

  const logout = async () => {
    setUser(null)
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}