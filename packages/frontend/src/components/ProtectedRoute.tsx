import { Navigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingOverlay visible />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
