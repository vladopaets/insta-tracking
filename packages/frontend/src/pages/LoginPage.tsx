import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Text,
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
    <Container size={420} my={80}>
      <Title ta="center" order={2}>
        Insta Ad Tracker
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isRegister ? 'Create an account' : 'Sign in to your account'}
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && <Alert color="red">{error}</Alert>}
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
            <Button type="submit" fullWidth loading={loading}>
              {isRegister ? 'Register' : 'Sign in'}
            </Button>
          </Stack>
        </form>
        <Text ta="center" mt="md" size="sm">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <Anchor component="button" type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Sign in' : 'Register'}
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
