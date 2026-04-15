import { AppShell, Group, Box, Tooltip } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/', num: '01' },
  { label: 'Ad Spending', path: '/ad-spending', num: '02' },
  { label: 'Income', path: '/income', num: '03' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 240, breakpoint: 'sm' }}
      padding={0}
      styles={{
        main: { background: 'transparent' },
        navbar: { background: 'transparent', border: 'none' },
        header: { background: 'transparent', border: 'none' },
      }}
    >
      <AppShell.Header>
        <div className="it-header" style={{ height: '100%' }}>
          <Group h="100%" px="xl" justify="space-between">
            <Group
              gap={10}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <span
                className="it-display-italic"
                style={{ fontSize: 26, color: 'var(--brass-deep)', lineHeight: 1 }}
              >
                ℐ
              </span>
              <Box>
                <div
                  className="it-display"
                  style={{ fontSize: 16, fontWeight: 500, lineHeight: 1 }}
                >
                  Insta Tracker
                </div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    marginTop: 2,
                    fontWeight: 600,
                  }}
                >
                  Practice Ledger
                </div>
              </Box>
            </Group>

            <Group gap={14}>
              <Box
                style={{
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Box
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--brass)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 14,
                  }}
                >
                  {user?.email?.[0]?.toUpperCase() ?? '·'}
                </Box>
                <span>{user?.email}</span>
              </Box>
              <Tooltip label="Sign out" position="bottom" withArrow>
                <button
                  className="it-icon-btn"
                  onClick={logout}
                  aria-label="Sign out"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </Tooltip>
            </Group>
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Navbar>
        <nav className="it-sidebar">
          <div
            className="it-eyebrow"
            style={{
              color: 'rgba(245,239,228,0.4)',
              padding: '18px 14px 14px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Menu
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <div
                  key={item.path}
                  className={`it-navlink ${active ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="it-navlink-num">{item.num}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 22,
              left: 20,
              right: 20,
              fontSize: 10,
              color: 'rgba(245,239,228,0.35)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 16,
              fontWeight: 500,
              zIndex: 1,
            }}
          >
            <div style={{ marginBottom: 4 }}>A Private Record</div>
            <div style={{ color: 'rgba(176,139,71,0.7)' }}>of Practice & Growth</div>
          </div>
        </nav>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box
          px={{ base: 'md', sm: 40 }}
          py={{ base: 'md', sm: 32 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
