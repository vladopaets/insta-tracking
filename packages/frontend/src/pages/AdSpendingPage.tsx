import { useState } from "react";
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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import {
  getAdSpending,
  createAdSpending,
  updateAdSpending,
  deleteAdSpending,
  type AdSpending,
  type CreateAdSpendingData,
} from "../api/ad-spending";

export function AdSpendingPage() {
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<AdSpending | null>(null);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["ad-spending"],
    queryFn: () => getAdSpending(),
  });

  const form = useForm<CreateAdSpendingData & { dateObj: Date | null }>({
    initialValues: {
      date: "",
      amount: 0,
      campaignName: "",
      description: "",
      platform: "instagram",
      dateObj: null,
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset();
    form.setFieldValue("dateObj", new Date());
    form.setFieldValue("date", dayjs().format("YYYY-MM-DD"));
    setOpened(true);
  };

  const openEdit = (entry: AdSpending) => {
    setEditing(entry);
    form.setValues({
      date: entry.date,
      amount: Number(entry.amount),
      campaignName: entry.campaignName ?? "",
      description: entry.description ?? "",
      platform: entry.platform,
      dateObj: new Date(entry.date),
    });
    setOpened(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateAdSpendingData) => createAdSpending(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-spending"] });
      setOpened(false);
      notifications.show({ message: "Entry added", color: "green" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateAdSpendingData>;
    }) => updateAdSpending(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-spending"] });
      setOpened(false);
      notifications.show({ message: "Entry updated", color: "green" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdSpending,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-spending"] });
      notifications.show({ message: "Entry deleted", color: "red" });
    },
  });

  const handleSubmit = () => {
    const { date, amount, campaignName, description, platform } = form.values;
    const data = { date, amount, campaignName, description, platform };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const total = entries.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />
      <Group justify="space-between" mb="md">
        <Title order={2}>Ad Spending</Title>
        <Button onClick={openCreate}>Add Expense</Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Campaign</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry) => (
            <Table.Tr key={entry.id}>
              <Table.Td>{dayjs(entry.date).format("MMM D, YYYY")}</Table.Td>
              <Table.Td>${Number(entry.amount).toFixed(2)}</Table.Td>
              <Table.Td>{entry.campaignName}</Table.Td>
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
            <Table.Td colSpan={3} />
          </Table.Tr>
        </Table.Tfoot>
      </Table>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? "Edit Expense" : "Add Expense"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Stack>
            <DateInput
              label="Date"
              required
              value={form.values.dateObj}
              onChange={(d) => {
                form.setFieldValue("dateObj", d ? new Date(d) : null);
                form.setFieldValue(
                  "date",
                  d ? dayjs(d).format("YYYY-MM-DD") : "",
                );
              }}
            />
            <NumberInput
              label="Amount"
              required
              min={0}
              decimalScale={2}
              prefix="$"
              {...form.getInputProps("amount")}
            />
            <TextInput
              label="Campaign Name"
              {...form.getInputProps("campaignName")}
            />
            <TextInput
              label="Description"
              {...form.getInputProps("description")}
            />
            <TextInput label="Platform" {...form.getInputProps("platform")} />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editing ? "Update" : "Add"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </div>
  );
}
