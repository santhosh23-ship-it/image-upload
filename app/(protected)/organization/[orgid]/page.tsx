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
  Container,
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

  if (loading)
    return (
      <Center h="70vh">
        <Loader size="lg" />
      </Center>
    );

  if (!org)
    return (
      <Center h="70vh">
        <Text fw={500}>Organization not found</Text>
      </Center>
    );

  const admins = org.users.filter((u: any) => u.role === "ADMIN");

  return (
    <Box bg="#f8f9fa" mih="100vh" py={40}>
      <Container size="lg">

        <Stack gap="xl">

          {/* Organization Header */}
          <Card shadow="sm" radius="lg" p="xl" withBorder>
            <Group justify="space-between">
              <Title order={2}>{org.name}</Title>
              <Badge size="lg" color="dark" variant="light">
                {admins.length} Admins
              </Badge>
            </Group>
          </Card>

          {/* Admin Section */}
          <Card shadow="sm" radius="lg" p="xl" withBorder>
            <Stack>
              <Title order={4}>Admins</Title>
              <Divider />
              <AdminList
                admins={admins}
                onSelectAdmin={handleSelectAdmin}
                selectedAdminId={selectedAdmin?.id}
              />
            </Stack>
          </Card>

          {selectedAdmin && (
            <>
              {/* Admin Details */}
              <Card shadow="sm" radius="lg" p="xl" withBorder>
                <Stack>
                  <Title order={4}>Admin Details</Title>
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
                      <Text fw={600}>Total Users</Text>
                      <Badge color="blue" variant="light">
                        {adminUsers.length}
                      </Badge>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>

              {/* Users */}
              <Card shadow="sm" radius="lg" p="xl" withBorder>
                <Stack>
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

      </Container>
    </Box>
  );
}