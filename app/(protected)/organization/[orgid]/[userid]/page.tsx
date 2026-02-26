"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Text,
  Card,
  Loader,
  Center,
  Grid,
  Badge,
  Divider,
  Stack,
} from "@mantine/core";

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.userid as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <Center mt={80}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center mt={80}>
        <Text fw={500}>User not found</Text>
      </Center>
    );
  }

  return (
    <Box p="xl" style={{ backgroundColor: "#faf5ec", minHeight: "100vh" }}>
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{ backgroundColor: "#f5e0c3", maxWidth: 700, margin: "auto" }}
      >
        <Stack spacing="md">

          {/* Header */}
          <Title order={3} ta="center">
            User Details
          </Title>

          <Divider />

          {/* Basic Info */}
          <Grid>
            <Grid.Col span={6}>
              <Text fw={600}>Name</Text>
              <Text>{user.name}</Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Email</Text>
              <Text>{user.email}</Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Role</Text>
              <Badge color="blue" variant="light">
                {user.role}
              </Badge>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Images Uploaded</Text>
              <Badge color="grape" variant="light">
                {user.imageCount ?? user._count?.images ?? 0}
              </Badge>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Payment Status</Text>
              {user.paymentDone ? (
                <Badge color="green" variant="filled">
                  Done
                </Badge>
              ) : (
                <Badge color="red" variant="filled">
                  Nil
                </Badge>
              )}
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </Box>
  );
}
