"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  Button,
  Title,
  Text,
  Container,
  Stack,
  Group,
  Card,
  Center,
  Box,
} from "@mantine/core";
import OrgForm from "@/app/(protected)/organization/orgForm";
import OrgTable from "@/app/(protected)/organization/orgTable";

export default function Page() {
  const { data: session, status } = useSession();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const load = async () => {
    const res = await fetch("/api/organization");
    const data = await res.json();
    setOrgs(data);
  };

  useEffect(() => {
    if (status === "authenticated") {
      load();
    }
  }, [status]);

  if (status === "loading") return <Text>Loading...</Text>;

  if (status === "unauthenticated") {
    return (
      <Container size="sm" py="xl" style={{ textAlign: "center" }}>
        <Title order={2}>You must be logged in</Title>
        <Text size="sm" mb="md">
          Redirecting to login...
        </Text>
        <Button onClick={() => signIn()}>Login</Button>
      </Container>
    );
  }

  return (
    <Box
      style={{
        backgroundColor: "#faf5ec",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <Box style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Center Title */}
        <Center>
          <Title order={2} mb="lg" style={{ color: "#4b2e2b" }}>
            Organization Details
          </Title>
        </Center>

        {/* Button Right Side */}
        <Group justify="flex-end" mb="md">
          <Button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
            style={{
              backgroundColor: "#5c4033",
              color: "white",
              fontWeight: 600,
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4b2e2b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#5c4033")
            }
          >
            Create Organization
          </Button>
        </Group>

        {/* Table inside Card */}
        <Card shadow="sm" radius="md" padding="md" withBorder>
          <OrgTable
            orgs={orgs}
            onEdit={(org: any) => {
              setEditData(org);
              setOpen(true);
            }}
            onRefresh={load}
          />
        </Card>

        {/* Modal Form */}
        <OrgForm
          opened={open}
          onClose={() => setOpen(false)}
          onSuccess={load}
          editData={editData}
        />
      </Box>
    </Box>
  );
}