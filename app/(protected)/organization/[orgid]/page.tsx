"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Text,
  Grid,
  Box,
  Title,
  Divider,
  Badge,
  Group,
  Loader,
  Center,
} from "@mantine/core";
import UserList from "../components/UserList";
import AdminList from "../components/AdminList";

export default function OrganizationDetailsPage() {
  const params = useParams();
  const orgId = params.orgid as string;

  const [org, setOrg] = useState<any>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await fetch(`/api/organization/${orgId}`);
        const data = await res.json();
        setOrg(data);
      } catch (error) {
        console.error("Failed to fetch org");
      } finally {
        setLoading(false);
      }
    };

    if (orgId) fetchOrg();
  }, [orgId]);

  const handleSelectAdmin = async (adminId: string) => {
    const res = await fetch(`/api/admin/users/${adminId}`);
    const data = await res.json();

    setSelectedAdmin(data.admin);
    setAdminUsers(data.users || []);
  };

  if (loading) {
    return (
      <Center mt={80}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!org) {
    return (
      <Center mt={80}>
        <Text fw={500}>Organization not found</Text>
      </Center>
    );
  }

  const admins = org.users.filter((u: any) => u.role === "ADMIN");

  return (
    <Box p="xl" style={{ backgroundColor: "#faf5ec", minHeight: "100vh" }}>
      <Stack spacing="xl">

        {/* ================= ORGANIZATION HEADER ================= */}
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="#e6ccb2">
          <Group justify="space-between">
            <Title order={2}>{org.name}</Title>
            <Badge size="lg" color="brown" variant="light">
              {admins.length} Admins
            </Badge>
          </Group>
        </Card>

        {/* ================= ADMIN LIST ================= */}
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="#f0d9c2">
          <Stack spacing="md">
            <Title order={4}>Admins</Title>
            <Divider />
            <AdminList admins={admins} onSelectAdmin={handleSelectAdmin} />
          </Stack>
        </Card>

        {/* ================= ADMIN DETAILS ================= */}
        {selectedAdmin && (
          <>
            <Card shadow="sm" padding="lg" radius="md" withBorder bg="#f5e0c3">
              <Stack spacing="md">
                <Title order={4}>
                  Admin Details
                </Title>
                <Divider />

                <Grid>
                  <Grid.Col span={6}>
                    <Text fw={600}>Name</Text>
                    <Text>{selectedAdmin.name}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text fw={600}>Email</Text>
                    <Text>{selectedAdmin.email}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text fw={600}>Images Uploaded</Text>
                    <Badge color="grape" variant="light">
                      {selectedAdmin.imageCount ?? 0}
                    </Badge>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text fw={600}>Payment Status</Text>
                    {selectedAdmin.paymentDone ? (
                      <Badge color="green" variant="filled">
                        Done
                      </Badge>
                    ) : (
                      <Badge color="red" variant="filled">
                        Nil
                      </Badge>
                    )}
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text fw={600}>Total Users</Text>
                    <Badge color="blue" variant="light">
                      {adminUsers.length}
                    </Badge>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* ================= USERS SECTION ================= */}
            <Card shadow="sm" padding="lg" radius="md" withBorder bg="#fff4e6">
              <Stack spacing="md">
                <Title order={4}>
                  Users Under {selectedAdmin.name}
                </Title>
                <Divider />
                <UserList users={adminUsers} orgId={orgId} />
              </Stack>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
}