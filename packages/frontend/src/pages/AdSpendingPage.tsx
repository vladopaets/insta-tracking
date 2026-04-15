import { useState } from 'react';
import {
  Modal,
  TextInput,
  NumberInput,
  Stack,
  LoadingOverlay,
  Box,
  Button,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import {
  getAdSpending,
  createAdSpending,
  updateAdSpending,
  deleteAdSpending,
  type AdSpending,
  type CreateAdSpendingData,
} from '../api/ad-spending';
import { TutorialSection } from '../components/TutorialSection';

export function AdSpendingPage() {
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<AdSpending | null>(null);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['ad-spending'],
    queryFn: () => getAdSpending(),
  });

  const form = useForm<CreateAdSpendingData & { dateObj: Date | null }>({
    initialValues: {
      date: '',
      amount: 0,
      campaignName: '',
      description: '',
      platform: 'instagram',
      dateObj: null,
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset();
    form.setFieldValue('dateObj', new Date());
    form.setFieldValue('date', dayjs().format('YYYY-MM-DD'));
    setOpened(true);
  };

  const openEdit = (entry: AdSpending) => {
    setEditing(entry);
    form.setValues({
      date: entry.date,
      amount: Number(entry.amount),
      campaignName: entry.campaignName ?? '',
      description: entry.description ?? '',
      platform: entry.platform,
      dateObj: new Date(entry.date),
    });
    setOpened(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateAdSpendingData) => createAdSpending(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-spending'] });
      setOpened(false);
      notifications.show({ message: 'Expense recorded', color: 'green' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAdSpendingData> }) =>
      updateAdSpending(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-spending'] });
      setOpened(false);
      notifications.show({ message: 'Entry updated', color: 'green' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdSpending,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-spending'] });
      notifications.show({ message: 'Entry removed', color: 'red' });
    },
  });

  const handleSubmit = () => {
    const { dateObj: _dateObj, ...data } = form.values;
    void _dateObj;
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
  };

  const total = entries.reduce((s, e) => s + Number(e.amount), 0);
  const sorted = [...entries].sort(
    (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix(),
  );

  return (
    <Box style={{ position: 'relative' }}>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ backgroundOpacity: 0.4, color: '#f5efe4' }}
      />

      <div className="it-section-head it-stagger">
        <div>
          <div className="it-eyebrow" style={{ marginBottom: 8 }}>
            §02 · Record of Investments
          </div>
          <h1 className="it-pagetitle">
            Ad <em>Spending</em>
          </h1>
          <div className="it-pagesub">
            Every dollar placed into advertising — dated, described, and accounted for.
          </div>
        </div>
        <button className="it-btn" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Record expense
        </button>
      </div>

      <div className="it-table-wrap it-stagger" style={{ marginBottom: 24 }}>
        <table className="it-table">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Date</th>
              <th style={{ width: 140 }}>Amount</th>
              <th>Campaign</th>
              <th>Platform</th>
              <th>Description</th>
              <th style={{ width: 110, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: 48,
                    color: 'var(--muted)',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 15,
                  }}
                >
                  No expenses recorded yet. Press <em>Record expense</em> to begin.
                </td>
              </tr>
            ) : (
              sorted.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>
                      {dayjs(entry.date).format('MMM D')}
                    </div>
                    <div
                      className="it-mono"
                      style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}
                    >
                      {dayjs(entry.date).format('YYYY')}
                    </div>
                  </td>
                  <td>
                    <span
                      className="it-mono"
                      style={{ color: 'var(--terracotta)', fontWeight: 500 }}
                    >
                      −${Number(entry.amount).toFixed(2)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{entry.campaignName || '—'}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: 'var(--paper-deep)',
                        fontSize: 11,
                        color: 'var(--ink-soft)',
                        textTransform: 'lowercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {entry.platform}
                    </span>
                  </td>
                  <td style={{ color: 'var(--ink-soft)' }}>{entry.description || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="it-icon-btn"
                      onClick={() => openEdit(entry)}
                      aria-label="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="it-icon-btn danger"
                      onClick={() => deleteMutation.mutate(entry.id)}
                      aria-label="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <tr>
                <td>Total</td>
                <td>
                  <span className="it-mono" style={{ color: 'var(--terracotta)' }}>
                    −${total.toFixed(2)}
                  </span>
                </td>
                <td colSpan={4}>
                  <span style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
                    across {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <TutorialSection
        eyebrow="How to record"
        title="Keeping *clean* books"
        intro="Good records make good decisions. A few small habits will keep this ledger trustworthy."
        steps={[
          {
            title: 'Record expenses promptly',
            body: 'Enter each ad invoice or boost on the day it happens. The dashboard can only be honest if the ledger is honest.',
          },
          {
            title: 'Name your campaigns',
            body: 'A short campaign name ("Autumn intake", "Couples counselling") makes it easy to see what is working when you look back.',
          },
          {
            title: 'Use description for context',
            body: 'Note audience, creative variant, or any experiment notes. Your future self will thank you when reviewing returns.',
          },
          {
            title: 'Edit or remove with care',
            body: 'Corrections are encouraged. Use the pencil icon to adjust an entry, and the trash icon only for true mistakes.',
          },
        ]}
      />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? 'Edit expense' : 'Record expense'}
        centered
        radius="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Stack>
            <DateInput
              label="Date"
              required
              value={form.values.dateObj}
              onChange={(d) => {
                form.setFieldValue('dateObj', d ? new Date(d) : null);
                form.setFieldValue('date', d ? dayjs(d).format('YYYY-MM-DD') : '');
              }}
            />
            <NumberInput
              label="Amount"
              required
              min={0}
              decimalScale={2}
              prefix="$"
              {...form.getInputProps('amount')}
            />
            <TextInput
              label="Campaign Name"
              placeholder="e.g. Autumn intake · Instagram reels"
              {...form.getInputProps('campaignName')}
            />
            <TextInput
              label="Description"
              placeholder="Audience, variant, any notes"
              {...form.getInputProps('description')}
            />
            <TextInput label="Platform" {...form.getInputProps('platform')} />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              color="dark"
              radius="xl"
              size="md"
            >
              {editing ? 'Save changes' : 'Record expense'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
