"use client";

import { Table, Title, Box } from "@mantine/core";

export default function AdminList({
  admins,
  onSelectAdmin,
}: {
  admins: any[];
  onSelectAdmin: (adminId: string) => void;  // ✅ accept id
}) {
  return (
    <Box style={{ overflowX: "auto" }}>
      <Title order={4} mb="sm" ta="center">
        Admins
      </Title>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td>

              <td
                style={{ cursor: "pointer", color: "#5c4033" }}
                onClick={() => onSelectAdmin(admin.id)}  // ✅ pass id
              >
                {admin.email}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}