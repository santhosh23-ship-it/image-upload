"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Title,
  Stack,
  Loader,
  Table,
  Group,
  Badge,
  SimpleGrid,
  Center,
  ThemeIcon,
  Paper,
} from "@mantine/core";
import {
  IconUsers,
  IconBuilding,
  IconShield,
  IconPhoto,
  IconUser,
} from "@tabler/icons-react";

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface OrganizationSummary {
  id: string;
  name: string;
  adminCount: number;
  userCount: number;
}

interface DashboardData {
  role: "ADMIN" | "PRODUCT_OWNER" | "USER";
  name?: string;
  email?: string;
  totalUploads?: number;
  organizationName?: string;
  adminCount?: number;
  userCount?: number;
  admins?: Admin[];
  users?: User[];
  organizations?: OrganizationSummary[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <Center mt="xl">
        <Loader size="lg" />
      </Center>
    );

  if (!data)
    return (
      <Center mt="xl">
        <Text>No data found</Text>
      </Center>
    );

  // ==========================
  // USER DASHBOARD
  // ==========================
  if (data.role === "USER") {
    return (
      <Stack gap="lg">
        <Title order={2}>User Dashboard</Title>

        <Card shadow="md" radius="lg" p="lg" withBorder>
          <Group>
            <ThemeIcon size="lg" radius="xl" color="blue" variant="light">
              <IconUser size={20} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">
                Name
              </Text>
              <Text fw={600}>{data.name}</Text>

              <Text size="sm" c="dimmed" mt="sm">
                Email
              </Text>
              <Text fw={600}>{data.email}</Text>
            </div>
          </Group>
        </Card>

        <Card shadow="md" radius="lg" p="lg" withBorder>
          <Group justify="space-between">
            <Group>
              <ThemeIcon color="grape" variant="light" radius="xl">
                <IconPhoto size={18} />
              </ThemeIcon>
              <Text fw={500}>Total Images Uploaded</Text>
            </Group>
            <Badge size="lg" color="grape">
              {data.totalUploads ?? 0}
            </Badge>
          </Group>
        </Card>
      </Stack>
    );
  }

  // ==========================
  // PRODUCT OWNER DASHBOARD
  // ==========================
  if (data.role === "PRODUCT_OWNER") {
    return (
      <Stack gap="lg">
        <Title order={2}>All Organizations</Title>

        <Paper shadow="sm" radius="lg" p="lg" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Organization</Table.Th>
                <Table.Th>Admins</Table.Th>
                <Table.Th>Users</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.organizations?.map((org) => (
                <Table.Tr key={org.id}>
                  <Table.Td fw={500}>{org.name}</Table.Td>
                  <Table.Td>
                    <Badge color="indigo" variant="light">
                      {org.adminCount}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light">
                      {org.userCount}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    );
  }

  // ==========================
  // ADMIN DASHBOARD
  // ==========================
  return (
    <Stack gap="lg">
      <Title order={2}>Admin Dashboard</Title>

      {/* Organization Info */}
      <Card shadow="md" radius="lg" p="lg" withBorder>
        <Group>
          <ThemeIcon size="lg" radius="xl" color="indigo" variant="light">
            <IconBuilding size={20} />
          </ThemeIcon>
          <div>
            <Text size="sm" c="dimmed">
              Organization
            </Text>
            <Text fw={600}>{data.organizationName}</Text>
          </div>
        </Group>
      </Card>

      {/* Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Card shadow="md" radius="lg" p="lg" withBorder>
          <Group justify="space-between">
            <Group>
              <ThemeIcon color="indigo" variant="light" radius="xl">
                <IconShield size={18} />
              </ThemeIcon>
              <Text fw={500}>Total Admins</Text>
            </Group>
            <Badge size="lg" color="indigo">
              {data.adminCount ?? 0}
            </Badge>
          </Group>
        </Card>

        <Card shadow="md" radius="lg" p="lg" withBorder>
          <Group justify="space-between">
            <Group>
              <ThemeIcon color="green" variant="light" radius="xl">
                <IconUsers size={18} />
              </ThemeIcon>
              <Text fw={500}>Total Users</Text>
            </Group>
            <Badge size="lg" color="green">
              {data.userCount ?? 0}
            </Badge>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Admin List */}
      <Paper shadow="md" radius="lg" p="lg" withBorder>
        <Title order={4} mb="md">
          Admin List
        </Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.admins?.length ? (
              data.admins.map((admin) => (
                <Table.Tr key={admin.id}>
                  <Table.Td fw={500}>{admin.name}</Table.Td>
                  <Table.Td c="dimmed">{admin.email}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text ta="center" c="dimmed">
                    No admins found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* User List */}
      <Paper shadow="md" radius="lg" p="lg" withBorder>
        <Title order={4} mb="md">
          Users List
        </Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.users?.length ? (
              data.users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td fw={500}>{user.name}</Table.Td>
                  <Table.Td c="dimmed">{user.email}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text ta="center" c="dimmed">
                    No users found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}