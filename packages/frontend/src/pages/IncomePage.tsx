import { useState } from 'react';
import {
  Title,
  Button,
  Table,
  Group,
  Modal,
  TextInput,
  NumberInput,
  Stack,
  ActionIcon,
  LoadingOverlay,
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

export function IncomePage() {
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['income'],
    queryFn: () => getIncome(),
  });

  const form = useForm<CreateIncomeData & { dateObj: Date | null }>({
    initialValues: { date: '', amount: 0, clientName: '', description: '', source: '', dateObj: null },
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
      notifications.show({ message: 'Income added', color: 'green' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateIncomeData> }) =>
      updateIncome(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      setOpened(false);
      notifications.show({ message: 'Income updated', color: 'green' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      notifications.show({ message: 'Income deleted', color: 'red' });
    },
  });

  const handleSubmit = () => {
    const { dateObj, ...data } = form.values;
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const total = entries.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} />
      <Group justify="space-between" mb="md">
        <Title order={2}>Income</Title>
        <Button onClick={openCreate} color="green">
          Add Income
        </Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Client</Table.Th>
            <Table.Th>Source</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry) => (
            <Table.Tr key={entry.id}>
              <Table.Td>{dayjs(entry.date).format('MMM D, YYYY')}</Table.Td>
              <Table.Td>${Number(entry.amount).toFixed(2)}</Table.Td>
              <Table.Td>{entry.clientName}</Table.Td>
              <Table.Td>{entry.source}</Table.Td>
              <Table.Td>{entry.description}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => openEdit(entry)}>
                    ✏️
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => deleteMutation.mutate(entry.id)}
                  >
                    🗑
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td fw={700}>Total</Table.Td>
            <Table.Td fw={700}>${total.toFixed(2)}</Table.Td>
            <Table.Td colSpan={4} />
          </Table.Tr>
        </Table.Tfoot>
      </Table>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? 'Edit Income' : 'Add Income'}
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
            <TextInput label="Client Name" {...form.getInputProps('clientName')} />
            <TextInput label="Source" placeholder="e.g. instagram, referral" {...form.getInputProps('source')} />
            <TextInput label="Description" {...form.getInputProps('description')} />
            <Button type="submit" color="green" loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}
