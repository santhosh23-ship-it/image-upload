"use client";

import {
  Table,
  Loader,
  Button,
  Group,
  Paper,
  Text,
  Badge,
} from "@mantine/core";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hidden?: boolean;

  _count?: {
    images?: number;
    payments?: number;
  };

  payments?: {
    slotsPurchased: number;
    amount: number;
    status: string;
  }[];
}

interface Props {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
}: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      onDelete(id);
    } else {
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <Group justify="center" mt="xl">
        <Loader size="lg" />
      </Group>
    );

  const visibleUsers = users.filter(
    (user) => user.role !== "PRODUCT_OWNER"
  );

  if (visibleUsers.length === 0)
    return (
      <Text ta="center" mt="md" c="dimmed">
        No users available.
      </Text>
    );

  return (
    <Paper
      shadow="lg"
      p="xl"
      radius="lg"
      style={{
        backgroundColor: "white",
        overflowX: "auto",
        border: "1px solid #eee",
      }}
    >
      <Table
        striped
        highlightOnHover
        horizontalSpacing="lg"
        verticalSpacing="md"
        style={{
          borderCollapse: "separate",
          borderSpacing: "0 8px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f3ebe4",
              borderRadius: "10px",
            }}
          >
            <th style={{ padding: "12px" }}>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Uploads</th>
            <th>Payments</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {visibleUsers.map((user) => (
            <tr
              key={user.id}
              style={{
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <td style={{ fontWeight: 600 }}>{user.name}</td>
              <td style={{ color: "#555" }}>{user.email}</td>

              <td>
                <Badge color="blue" variant="light" radius="sm">
                  {user.role}
                </Badge>
              </td>

              <td>
                <Badge color="grape" variant="light">
                  {user._count?.images ?? 0}
                </Badge>
              </td>

              <td>
                <Badge color="green" variant="light">
                  {user._count?.payments ?? 0}
                </Badge>
              </td>

              <td>
                {user.hidden ? (
                  <Badge color="gray" variant="outline">
                    Hidden
                  </Badge>
                ) : (
                  <Badge color="green" variant="outline">
                    Active
                  </Badge>
                )}
              </td>

              <td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    style={{
                      backgroundColor: "#5c4033",
                      color: "white",
                    }}
                    radius="md"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="xs"
                    color="red"
                    radius="md"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
}