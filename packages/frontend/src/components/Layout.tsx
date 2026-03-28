import { AppShell, NavLink, Group, Title, ActionIcon, Box } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Ad Spending', path: '/ad-spending' },
  { label: 'Income', path: '/income' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 220, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            Insta Tracker
          </Title>
          <Group gap="sm">
            <Box size="sm" style={{ fontSize: '0.85rem' }}>{user?.email}</Box>
            <ActionIcon variant="subtle" color="gray" onClick={logout} title="Logout">
              ⏻
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
