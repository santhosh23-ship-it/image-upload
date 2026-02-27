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
  Box,
} from "@mantine/core";
import {
  IconUsers,
  IconBuilding,
  IconShield,
  IconPhoto,
  IconUser,
} from "@tabler/icons-react";

/* 🔥 Reusable Premium Card Style */
const glassCardStyle = {
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
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

  return (
    <Box
      style={{
        minHeight: "100vh",
        padding: "30px",
        background:
          "linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)",
      }}
    >
      <Stack gap="xl">

        {/* ================= USER ================= */}
        {data.role === "USER" && (
          <>
            <Title order={2} fw={700}>
              User Dashboard
            </Title>

            <Card radius="xl" p="xl" style={glassCardStyle}>
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

            <Card radius="xl" p="xl" style={glassCardStyle}>
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="grape" variant="light" radius="xl">
                    <IconPhoto size={18} />
                  </ThemeIcon>
                  <Text fw={500}>Total Images Uploaded</Text>
                </Group>
                <Badge size="lg" color="grape" radius="md">
                  {data.totalUploads ?? 0}
                </Badge>
              </Group>
            </Card>
          </>
        )}

        {/* ================= PRODUCT OWNER ================= */}
        {data.role === "PRODUCT_OWNER" && (
          <>
            <Title order={2} fw={700}>
              All Organizations
            </Title>

            <Paper radius="xl" p="xl" style={glassCardStyle}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Organization</Table.Th>
                    <Table.Th>Admins</Table.Th>
                    <Table.Th>Users</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.organizations?.map((org: any) => (
                    <Table.Tr key={org.id}>
                      <Table.Td fw={600}>{org.name}</Table.Td>
                      <Table.Td>
                        <Badge color="indigo" variant="light" radius="md">
                          {org.adminCount}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color="green" variant="light" radius="md">
                          {org.userCount}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </>
        )}

        {/* ================= ADMIN ================= */}
        {data.role === "ADMIN" && (
          <>
            <Title order={2} fw={700}>
              Admin Dashboard
            </Title>

            <Card radius="xl" p="xl" style={glassCardStyle}>
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

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <Card radius="xl" p="xl" style={glassCardStyle}>
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="indigo" variant="light" radius="xl">
                      <IconShield size={18} />
                    </ThemeIcon>
                    <Text fw={500}>Total Admins</Text>
                  </Group>
                  <Badge size="lg" color="indigo" radius="md">
                    {data.adminCount ?? 0}
                  </Badge>
                </Group>
              </Card>

              <Card radius="xl" p="xl" style={glassCardStyle}>
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="green" variant="light" radius="xl">
                      <IconUsers size={18} />
                    </ThemeIcon>
                    <Text fw={500}>Total Users</Text>
                  </Group>
                  <Badge size="lg" color="green" radius="md">
                    {data.userCount ?? 0}
                  </Badge>
                </Group>
              </Card>
            </SimpleGrid>

            <Paper radius="xl" p="xl" style={glassCardStyle}>
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
                    data.admins.map((admin: any) => (
                      <Table.Tr key={admin.id}>
                        <Table.Td fw={600}>{admin.name}</Table.Td>
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
          </>
        )}
      </Stack>
    </Box>
  );
}