"use client";

import { Modal, Button, TextInput, FileInput, Image } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function OrgForm({ opened, onClose, onSuccess, editData }: any) {
  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      logoUrl: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.setValues({
        ...editData,
        adminEmail: "",
        adminPassword: "",
      });
    } else {
      form.reset();
    }
  }, [editData]);

  const handleSubmit = async (values: any) => {
    const url = editData
      ? `/api/organization/${editData.id}`
      : "/api/organization";

    const res = await fetch(url, {
      method: editData ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    await onSuccess(); // ✅ wait fetch
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editData ? "Edit Organization" : "Create Organization"}
      overlayProps={{
        color: "#000", // overlay color
        opacity: 0.55, // overlay opacity
        blur: 3,       // blur effect
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Name" required {...form.getInputProps("name")} />
        <TextInput label="Address" {...form.getInputProps("address")} />
        <TextInput label="Phone" {...form.getInputProps("phone")} />

        <FileInput
          label="Logo"
          accept="image/*"
          onChange={async (file) => {
            if (!file) return;

            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload-logo", {
              method: "POST",
              body: fd,
            });

            const data = await res.json();

            if (res.ok && data.logoUrl) {
              form.setFieldValue("logoUrl", data.logoUrl);
            }
          }}
        />

        {form.values.logoUrl && (
          <Image src={form.values.logoUrl} width={120} mt="sm" />
        )}

        {!editData && (
          <>
            <TextInput label="Admin Email" {...form.getInputProps("adminEmail")} />
            <TextInput
              label="Admin Password"
              type="password"
              {...form.getInputProps("adminPassword")}
            />
          </>
        )}

        <Button
          fullWidth
          mt="md"
          type="submit"
          style={{
            backgroundColor: "#5c4033",
            color: "white",
            fontWeight: 600,
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4b2e2b";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#5c4033";
          }}
        >
          {editData ? "Update" : "Create"}
        </Button>
      </form>
    </Modal>
  );
}