import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { setRole } from '../role';

import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: 'success', text: 'Mengecek kredensial...' });
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch role from profiles
        const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
        
        if (profileError) throw profileError;

        const role = profile.role || 'applicant';
        setRole(role);
        localStorage.setItem('registeredUser', JSON.stringify(profile));

        setStatus({ type: 'success', text: 'Login berhasil! Mengalihkan...' });
        
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/dashboard');
            window.location.reload(); // Refresh untuk memperbarui state navbar/role di level atas
          } else {
            navigate('/profile');
            window.location.reload();
          }
        }, 1000);
      }
    } catch (err) {
      setStatus({ type: 'error', text: err.message === 'Invalid login credentials' ? 'Email atau kata sandi salah!' : err.message });
    }
  };


  return (
    <div className="container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 150px)', padding: '4rem 1.5rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Selamat Datang</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Masuk ke akun <span className="text-cyan font-bold">BeaSIte</span> Anda</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail className="search-icon" size={20} />
              <input 
                type="email" 
                className="search-input" 
                placeholder="nama@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '3rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Kata Sandi</label>
              <a href="#" className="text-cyan" style={{ fontSize: '0.875rem' }}>Lupa Sandi?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock className="search-icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="search-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '3rem', paddingRight: '3rem', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
            Masuk <LogIn size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: 'var(--text-secondary)' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span style={{ padding: '0 1rem', fontSize: '0.875rem' }}>Atau masuk dengan</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ padding: '1rem', display: 'flex', gap: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            onClick={() => {
              setStatus({ type: 'success', text: 'Sinkronisasi Google sedang diproses...' });
              setTimeout(() => {
                setRole('applicant');
                setStatus({ type: 'success', text: 'Berhasil login dengan Google! Mengalihkan...' });
                setTimeout(() => { window.location.href = '/profile'; }, 1000);
              }, 1500);
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>
        </form>

        {status && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginTop: '1.5rem',
            textAlign: 'center',
            backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`
          }}>
            {status.text}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Belum punya akun?{' '}
          <Link to="/register" className="text-cyan" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            Daftar Sekarang <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
