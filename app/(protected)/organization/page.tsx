"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  Button,
  Title,
  Text,
  Container,
  Group,
  Card,
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
    try {
      const res = await fetch("/api/organization");
      const data = await res.json();



    console.log("API RESPONSE:", data);

    
      // 🔥 SAFETY CHECK (NO LOGIC CHANGE)
      setOrgs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setOrgs([]);
    }
  };

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  if (status === "loading") return <Text ta="center">Loading...</Text>;

  if (status === "unauthenticated") {
    return (
      <Container size="sm" py="xl" ta="center">
        <Title order={2}>Login Required</Title>
        <Button mt="md" onClick={() => signIn()}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Box
      style={{
        background: "#f8f5f2",
        minHeight: "100vh",
        padding: "50px 20px",
      }}
    >
      <Container size="lg">
        <Group justify="space-between" mb="xl">
          <Title order={2} fw={700}>
            Organization Details
          </Title>

          <Button
            radius="md"
            size="md"
            variant="filled"
            color="dark"
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            + Create Organization
          </Button>
        </Group>

        <Card
          shadow="md"
          radius="lg"
          padding="xl"
          withBorder
          style={{ backgroundColor: "white" }}
        >
          <OrgTable
            orgs={orgs}
            onEdit={(org: any) => {
              setEditData(org);
              setOpen(true);
            }}
            onRefresh={load}
          />
        </Card>

        <OrgForm
          opened={open}
          onClose={() => setOpen(false)}
          onSuccess={load}
          editData={editData}
        />
      </Container>
    </Box>
  );
}