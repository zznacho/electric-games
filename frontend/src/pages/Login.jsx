import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'


export default function Login() {
const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
const [error, setError] = useState('')
const { login } = useAuth()
const nav = useNavigate()


const handle = async (e) => {
e.preventDefault()
try {
await login(form.usernameOrEmail, form.password)
nav('/')
} catch (err) {
setError(err.response?.data?.msg || 'Error al iniciar sesión')
}
}


return (
<div className="max-w-md mx-auto mt-12">
<h2 className="text-2xl mb-4">Iniciar sesión</h2>
<form onSubmit={handle} className="space-y-3">
<input value={form.usernameOrEmail} onChange={e => setForm({ ...form, usernameOrEmail: e.target.value })} placeholder="Usuario o email" className="w-full p-2 rounded bg-gray-700" />
<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" className="w-full p-2 rounded bg-gray-700" />
{error && <div className="text-red-400">{error}</div>}
<button className="w-full py-2 bg-blue-600 rounded">Entrar</button>
</form>
</div>
)
}