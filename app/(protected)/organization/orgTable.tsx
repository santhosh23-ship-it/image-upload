"use client";

import { Table, Button, Group, Image, Paper, Center } from "@mantine/core";
import styles from "@/app/styles/org.module.css";
import { useRouter } from "next/navigation";

export default function OrgTable({ orgs, onEdit, onRefresh }: any) {
  const router = useRouter();

  const deleteOrg = async (id: string) => {
    await fetch(`/api/organization/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <Center style={{ marginTop: 20, marginBottom: 20 }}>
      <Paper
        shadow="sm"
        radius="lg"
        withBorder
        p="xl"
        className={styles.wrapper}
        style={{ backgroundColor: "#f5e6d8", maxWidth: "1100px", width: "100%" }}
      >
        <div style={{ overflowX: "auto", borderRadius: 12 }}>
          <Table
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="xl"
            className={styles.table}
            style={{ borderCollapse: "separate", borderSpacing: 0, borderRadius: 18 }}
          >
            {/* 👇 No spaces/new lines inside thead */}
            <thead  style={{ backgroundColor: "#d2b48c" }}>
              <tr>
                <th style={{ backgroundColor: "#d2b48c", padding: "12px 16px" }}>Name</th>
                <th style={{ backgroundColor: "#d2b48c", padding: "12px 16px" }}>Logo</th>
                <th style={{ backgroundColor: "#d2b48c", padding: "12px 16px" }}>Address</th>
                <th style={{ backgroundColor: "#d2b48c", padding: "12px 16px" }}>Phone</th>
                <th style={{ backgroundColor: "#d2b48c", padding: "12px 16px" }}>Admin Email</th>
                <th style={{ backgroundColor: "#d2b48c", padding: "12px 16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org: any) => (
                <tr key={org.id}>
                  <td>{org.name}</td>

                  <td>
                    {org.logoUrl ? (
                      <Image src={org.logoUrl} alt="logo" className={styles.logo} />
                    ) : (
                      <span className={styles.noLogo}>No Logo</span>
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
                        style={{ backgroundColor: "#5c4033", color: "white" }}
                        onClick={() => onEdit(org)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="xs"
                        variant="light"
                        style={{ backgroundColor: "#8b0000", color: "white" }}
                        onClick={() => deleteOrg(org.id)}
                      >
                        Delete
                      </Button>

                      <Button
                        size="xs"
                        variant="light"
                        style={{ backgroundColor: "#a67b5b", color: "white" }}
                        onClick={() => router.push(`/organization/${org.id}`)}
                      >
                        View Details
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Paper>
    </Center>
  );
}