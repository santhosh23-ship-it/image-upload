"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Modal,
  Title,
  Group,
  Paper,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import UserForm from "./UserForm";
import EditUserForm from "./EditUserForm";
import UserTable from "./UserTable";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status]);

  /* 🔥 DELETE FROM UI INSTANTLY */
  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  if (status === "loading") return null;

  return (
    <Paper p="md" style={{ minHeight: "100vh" }}>
      <Container size="lg">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Admin Dashboard</Title>

          <Button
            onClick={() => setCreateModal(true)}
            style={{
              backgroundColor: "#5c4033",
              color: "white",
              fontWeight: 600,
            }}
          >
            + Add User
          </Button>
        </Group>

        <UserTable
          users={users}
          loading={loading}
          onEdit={setEditUser}
          onDelete={handleDeleteUser}  
        />

        {/* Create Modal */}
        <Modal
          opened={createModal}
          onClose={() => setCreateModal(false)}
          title="Create User"
        >
          <UserForm
            onSuccess={() => {
              setCreateModal(false);
              fetchUsers();
            }}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          opened={!!editUser}
          onClose={() => setEditUser(null)}
          title="Edit User"
        >
          {editUser && (
            <EditUserForm
              user={editUser}
              onSuccess={() => {
                setEditUser(null);
                fetchUsers();
              }}
            />
          )}
        </Modal>
      </Container>
    </Paper>
  );
}