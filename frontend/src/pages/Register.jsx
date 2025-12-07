import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'


export default function Register() {
const [form, setForm] = useState({ username: '', email: '', password: '' })
const [error, setError] = useState('')
const { register } = useAuth()
const nav = useNavigate()


const submit = async (e) => {
e.preventDefault()
try {
await register(form.username, form.email, form.password)
nav('/')
} catch (err) {
setError(err.response?.data?.msg || 'Error al registrar')
}
}


return (
<div className="max-w-md mx-auto mt-12">
<h2 className="text-2xl mb-4">Registro</h2>
<form onSubmit={submit} className="space-y-3">
<input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Usuario" className="w-full p-2 rounded bg-gray-700" />
<input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full p-2 rounded bg-gray-700" />
<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" className="w-full p-2 rounded bg-gray-700" />
{error && <div className="text-red-400">{error}</div>}
<button className="w-full py-2 bg-green-600 rounded">Crear cuenta</button>
</form>
</div>
)
}