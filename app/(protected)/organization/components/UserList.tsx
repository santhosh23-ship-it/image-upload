"use client";

import { Table, Box, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function UserList({ users = [], orgId }: any) {
  const router = useRouter();

  return (
    <Box style={{ overflowX: "auto" }}>
      {users.length === 0 ? (
        <Text ta="center" c="dimmed">
          No users available
        </Text>
      ) : (
        <Table striped highlightOnHover withColumnBorders>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() =>
                    router.push(`/organization/${orgId}/${user.id}`)
                  }
                >
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Box>
  );
}