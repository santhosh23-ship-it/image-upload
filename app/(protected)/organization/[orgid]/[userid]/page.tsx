"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Title,
  Stack,
  Loader,
  Badge,
  Group,
  Divider,
  Center,
  Container,
  Box,
} from "@mantine/core";
import { useParams } from "next/navigation";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  imageCount: number;
  paymentCount: number;
  tags: string[];
}

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.userid as string;

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/images/${userId}`);
        const data = await res.json();

        if (data.success) {
          setUser({
            ...data.user,
            tags: data.user.tags || [],
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <Center h="70vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center h="70vh">
        <Text fw={500}>User not found</Text>
      </Center>
    );
  }

  return (
    <Box bg="#f8f9fa" mih="100vh" py={60}>
      <Container size="sm">
        <Card shadow="lg" radius="lg" p="xl" withBorder>

          <Stack gap="lg">

            {/* Header */}
            <Title order={3} ta="center" fw={600}>
              User Details
            </Title>

            <Divider />

            {/* Basic Info */}
            <Stack gap={6}>
              <Text><b>Name:</b> {user.name}</Text>
              <Text><b>Email:</b> {user.email}</Text>
              <Text><b>Role:</b> {user.role}</Text>
            </Stack>

            <Divider />

            {/* Stats */}
            <Group justify="center" gap="md">
              <Badge
                size="lg"
                radius="md"
                variant="light"
                color="blue"
              >
                Images: {user.imageCount}
              </Badge>

              <Badge
                size="lg"
                radius="md"
                variant="light"
                color="green"
              >
                Payments: {user.paymentCount}
              </Badge>
            </Group>

            <Divider />

            {/* Tags */}
            <Stack gap="xs">
              <Title order={5}>Tags</Title>

              {user.tags.length === 0 ? (
                <Text c="dimmed">No tags available</Text>
              ) : (
                <Group gap="xs">
                  {user.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="light"
                      color="gray"
                      radius="sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </Group>
              )}
            </Stack>

          </Stack>
        </Card>
      </Container>
    </Box>
  );
}