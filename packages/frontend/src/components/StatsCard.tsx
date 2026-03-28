import { Paper, Text, Group } from '@mantine/core';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatsCard({ title, value, subtitle, color }: StatsCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
        {title}
      </Text>
      <Group align="flex-end" gap="xs" mt={4}>
        <Text size="xl" fw={700} c={color}>
          {value}
        </Text>
      </Group>
      {subtitle && (
        <Text size="xs" c="dimmed" mt={4}>
          {subtitle}
        </Text>
      )}
    </Paper>
  );
}
