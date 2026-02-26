"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Stack,
  Paper,
} from "@mantine/core";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: User;
  onSuccess: () => void;
}

export default function EditUserForm({ user, onSuccess }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("User updated successfully ✅");
      onSuccess();

    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      p="md"
      radius="md"
      style={{ backgroundColor: "#f5f1ec" }}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <PasswordInput
            label="Password (leave blank to keep old)"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />

          <Select
            label="Role"
            value={role}
            onChange={(val) => setRole(val || "USER")}
            data={[
              { value: "USER", label: "User" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />

          <Button
            type="submit"
            loading={loading}
            style={{
              backgroundColor: "#5c4033",
              color: "white",
              fontWeight: 600,
            }}
          >
            Update User
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}