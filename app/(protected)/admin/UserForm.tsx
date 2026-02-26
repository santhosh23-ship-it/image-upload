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

interface Props {
  onSuccess: () => void;
}

export default function UserForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "User creation failed");
        return;
      }

      alert("User created successfully ✅");

      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");

      onSuccess();
    } catch (error) {
      console.error("Create error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="sm" radius="md" p="lg" bg="#f5f1ec">
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <PasswordInput
            label="Password"
            required
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

          <Button type="submit" loading={loading} bg="#5c4033">
            Create User
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}