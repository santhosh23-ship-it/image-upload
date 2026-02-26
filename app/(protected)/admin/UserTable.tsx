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

  if (loading) return <Loader mt="xl" />;

  const visibleUsers = users.filter(
    (user) => user.role !== "PRODUCT_OWNER"
  );

  if (visibleUsers.length === 0)
    return <Text mt="md">No users available.</Text>;

  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      style={{ overflowX: "auto", backgroundColor: "#f5f1ec" }}
    >
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
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
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              {/* Upload Count */}
              <td>
                <Badge color="grape" variant="light">
                  {user._count?.images ?? 0}
                </Badge>
              </td>

              {/* Payment Count */}
              <td>
                <Badge color="green" variant="light">
                  {user._count?.payments ?? 0}
                </Badge>
              </td>

              {/* Status */}
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

              {/* Actions */}
              <td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    bg="#5c4033"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="xs"
                    color="red"
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