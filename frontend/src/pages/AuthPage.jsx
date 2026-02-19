import { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { saveAuth } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const path = mode === 'login' ? '/auth/login' : '/auth/register';
    const { data } = await client.post(path, form);
    saveAuth(data);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      {mode === 'register' && <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />}
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Continue</button>
      <small onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>Switch to {mode === 'login' ? 'register' : 'login'}</small>
    </form>
  );
}
