"use client";
import { Table, Box } from "@mantine/core";

export default function AdminList({
  admins,
  onSelectAdmin,
  selectedAdminId,
}: any) {
  return (
    <Box style={{ overflowX: "auto" }}>
      <Table striped highlightOnHover withColumnBorders>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin: any) => (
            <tr
              key={admin.id}
              style={{
                backgroundColor:
                  admin.id === selectedAdminId
                    ? "#f1f3f5"
                    : "transparent",
              }}
            >
              <td>{admin.name}</td>
              <td
                style={{
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => onSelectAdmin(admin.id)}
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