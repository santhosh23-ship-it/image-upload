"use client";

import { Table, Title, Box, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function UserList({
  users = [],
  orgId,
}: {
  users?: any[];
  orgId: string;
}) {
  const router = useRouter();

  return (
    <Box style={{ overflowX: "auto", marginTop: 20 }}>
      <Title order={4} mb="sm" ta="center">
        Users
      </Title>

      {users.length === 0 ? (
        <Text ta="center">No users available</Text>
      ) : (
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>

                <td
                  style={{
                    cursor: "pointer",
                    color: "#5c4033",
                    fontWeight: 600,
                  }}
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