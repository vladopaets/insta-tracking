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
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  type Income,
  type CreateIncomeData,
} from '../api/income';
import { TutorialSection } from '../components/TutorialSection';

export function IncomePage() {
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['income'],
    queryFn: () => getIncome(),
  });

  const form = useForm<CreateIncomeData & { dateObj: Date | null }>({
    initialValues: {
      date: '',
      amount: 0,
      clientName: '',
      description: '',
      source: '',
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

  const openEdit = (entry: Income) => {
    setEditing(entry);
    form.setValues({
      date: entry.date,
      amount: Number(entry.amount),
      clientName: entry.clientName ?? '',
      description: entry.description ?? '',
      source: entry.source ?? '',
      dateObj: new Date(entry.date),
    });
    setOpened(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateIncomeData) => createIncome(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      setOpened(false);
      notifications.show({ message: 'Income recorded', color: 'green' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateIncomeData> }) =>
      updateIncome(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      setOpened(false);
      notifications.show({ message: 'Entry updated', color: 'green' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
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
            §03 · Record of Returns
          </div>
          <h1 className="it-pagetitle">
            <em>Income</em>
          </h1>
          <div className="it-pagesub">
            Every client, every session — the work that follows from your investments.
          </div>
        </div>
        <button className="it-btn it-btn-income" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Record income
        </button>
      </div>

      <div className="it-table-wrap it-stagger" style={{ marginBottom: 24 }}>
        <table className="it-table">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Date</th>
              <th style={{ width: 140 }}>Amount</th>
              <th>Client</th>
              <th>Source</th>
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
                  No income recorded yet. Press <em>Record income</em> to begin.
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
                      style={{ color: 'var(--sage)', fontWeight: 500 }}
                    >
                      +${Number(entry.amount).toFixed(2)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{entry.clientName || '—'}</td>
                  <td>
                    {entry.source ? (
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: 999,
                          background: 'var(--income-bg)',
                          fontSize: 11,
                          color: 'var(--sage)',
                          textTransform: 'lowercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {entry.source}
                      </span>
                    ) : (
                      '—'
                    )}
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
                  <span className="it-mono" style={{ color: 'var(--sage)' }}>
                    +${total.toFixed(2)}
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
        title="Tracking *returns* well"
        intro="A short guide to recording income that makes the dashboard meaningful."
        steps={[
          {
            title: 'Log every payment',
            body: 'Session fees, package sales, workshop revenue — anything that comes in because of your practice belongs here.',
          },
          {
            title: 'Attribute the source',
            body: 'Use "instagram" for leads that came through ads, "referral" for word-of-mouth. Clear sources reveal what advertising truly earns you.',
          },
          {
            title: 'Name the client',
            body: 'A first name or initials is enough. It helps the "top sources" panel show who contributes most to the practice.',
          },
          {
            title: 'Return to the dashboard',
            body: 'After recording, switch back to §01 to see the updated ROI and the revised running net.',
          },
        ]}
      />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? 'Edit income' : 'Record income'}
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
              label="Client Name"
              placeholder="First name or initials"
              {...form.getInputProps('clientName')}
            />
            <TextInput
              label="Source"
              placeholder="e.g. instagram · referral · workshop"
              {...form.getInputProps('source')}
            />
            <TextInput
              label="Description"
              placeholder="Session type, notes"
              {...form.getInputProps('description')}
            />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              color="green"
              radius="xl"
              size="md"
            >
              {editing ? 'Save changes' : 'Record income'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
