"use client";

import { Table, Button, Group, Image, Badge } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function OrgTable({ orgs, onEdit, onRefresh }: any) {
  const router = useRouter();

  const deleteOrg = async (id: string) => {
    await fetch(`/api/organization/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <Table
      striped
      highlightOnHover
      verticalSpacing="md"
      horizontalSpacing="lg"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Logo</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Email</th>
          <th style={{ textAlign: "center" }}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {orgs.map((org: any) => (
          <tr key={org.id}>
            <td>
              <Badge variant="light" color="dark">
                {org.name}
              </Badge>
            </td>

            <td>
              {org.logoUrl ? (
                <Image
                  src={org.logoUrl}
                  radius="md"
                  w={55}
                  h={55}
                  fit="cover"
                />
              ) : (
                "-"
              )}
            </td>

            <td>{org.address ?? "-"}</td>
            <td>{org.phone ?? "-"}</td>
            <td>{org.admin?.email ?? "-"}</td>

            <td>
              <Group justify="center" gap="xs">
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  radius="md"
                  onClick={() => onEdit(org)}
                >
                  Edit
                </Button>

                <Button
                  size="xs"
                  variant="light"
                  color="red"
                  radius="md"
                  onClick={() => deleteOrg(org.id)}
                >
                  Delete
                </Button>

                <Button
                  size="xs"
                  variant="filled"
                  color="dark"
                  radius="md"
                  onClick={() =>
                    router.push(`/organization/${org.id}`)
                  }
                >
                  View
                </Button>
              </Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}