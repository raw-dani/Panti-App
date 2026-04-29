import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, User } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await register({ name, email, password, password_confirmation: password, role: 'staff' });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Login/Register gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        margin: '0 1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        padding: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #0F4C81, #1e40af)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 15px 35px rgba(15, 76, 129, 0.3)'
          }}>
            <Lock style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1e293b, #475569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.75rem'
          }}>
            {isLogin ? 'Masuk' : 'Daftar'}
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '1rem',
            margin: 0 
          }}>
            Kelola data Panti Asuhan dengan mudah
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {!isLogin && (
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.75rem' 
              }}>
                Nama Lengkap
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '18px', 
                  height: '18px', 
                  color: '#9ca3af' 
                }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 1rem 14px 3.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    background: 'white',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.75rem' 
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '18px', 
                height: '18px', 
                color: '#9ca3af' 
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 1rem 14px 3.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  background: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
                placeholder="staff@panti.com"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.75rem' 
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '18px', 
                height: '18px', 
                color: '#9ca3af' 
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 1rem 14px 3.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  background: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0F4C81, #1e40af)',
              color: 'white',
              fontWeight: '600',
              padding: '1rem',
              borderRadius: '14px',
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(15, 76, 129, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Memproses...
              </>
            ) : (
              <>
                <Lock style={{ width: '18px', height: '18px' }} />
                {isLogin ? 'Masuk' : 'Daftar'}
              </>
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center' 
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              fontSize: '0.875rem',
              color: '#0F4C81',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              transition: 'all 0.3s ease'
            }}
          >
            {isLogin ? 'Belum punya akun? Daftar sekarang' : 'Sudah punya akun? Masuk'}
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(15, 76, 129, 0.1)',
          border: '1px solid rgba(15, 76, 129, 0.2)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '0.8rem', 
            color: '#0F4C81', 
            margin: 0,
            fontWeight: '500'
          }}>
            <strong>💡 Demo:</strong> staff@panti.com / password
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;

