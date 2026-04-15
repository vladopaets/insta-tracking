import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name || undefined);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="it-login-wrap">
      <div className="it-login-card it-stagger">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 48,
              color: 'var(--brass-deep)',
              lineHeight: 1,
              fontVariationSettings: "'SOFT' 100, 'opsz' 144",
            }}
          >
            ℐ
          </div>
          <div className="it-eyebrow" style={{ marginTop: 14 }}>
            Practice Ledger · Est. 2026
          </div>
          <h1
            className="it-display"
            style={{
              fontSize: 34,
              margin: '10px 0 4px',
              letterSpacing: '-0.025em',
              fontWeight: 400,
            }}
          >
            Insta <em className="it-display-italic" style={{ color: 'var(--brass-deep)' }}>Tracker</em>
          </h1>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
            {isRegister ? 'A new private record' : 'Welcome back'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert color="red" radius="md" variant="light">
                {error}
              </Alert>
            )}
            {isRegister && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            )}
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button
              type="submit"
              fullWidth
              loading={loading}
              color="dark"
              size="md"
              radius="xl"
            >
              {isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </Stack>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: 22,
            paddingTop: 20,
            borderTop: '1px solid var(--rule)',
            fontSize: 13,
            color: 'var(--ink-soft)',
          }}
        >
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brass-deep)',
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontSize: 13,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
