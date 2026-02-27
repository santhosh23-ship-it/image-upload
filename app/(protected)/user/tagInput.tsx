"use client";

import { useEffect, useState } from "react";
import { MultiSelect } from "@mantine/core";

export default function TagInput({ onTagSelect, currentUserName }: { currentUserName: string; onTagSelect: (user: { id: string; name: string }) => void }) {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : Array.isArray(data.users) ? data.users : []);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <MultiSelect
      label="Tag Users"
      placeholder="Select users"
      data={users.map(u => ({ value: u.id, label: u.name }))}
      onChange={selectedIds => {
        const selectedUsers = users.filter(u => selectedIds.includes(u.id));
        selectedUsers.forEach(user => onTagSelect(user));
      }}
      searchable
      clearable
    />
  );
}