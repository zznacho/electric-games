// --- frontend/src/auth/AuthProvider.jsx ---
import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'


const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)


useEffect(() => {
const token = localStorage.getItem('eg_token')
const userJson = localStorage.getItem('eg_user')
if (token && userJson) setUser(JSON.parse(userJson))
setLoading(false)
}, [])


const login = async (usernameOrEmail, password) => {
const res = await api.post('/auth/login', { usernameOrEmail, password })
localStorage.setItem('eg_token', res.data.token)
localStorage.setItem('eg_user', JSON.stringify(res.data.user))
setUser(res.data.user)
return res.data
}


const register = async (username, email, password) => {
const res = await api.post('/auth/register', { username, email, password })
localStorage.setItem('eg_token', res.data.token)
localStorage.setItem('eg_user', JSON.stringify(res.data.user))
setUser(res.data.user)
return res.data
}


const logout = () => {
localStorage.removeItem('eg_token')
localStorage.removeItem('eg_user')
setUser(null)
}


return (
<AuthContext.Provider value={{ user, loading, login, register, logout }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)