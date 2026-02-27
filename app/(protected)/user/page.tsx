"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Card, Group, Image, Text, Badge, Button, Stack, Modal, ActionIcon, ScrollArea, Box, Title, Alert } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash, IconAlertCircle } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TagInput from "./tagInput";

const MAX_FREE_IMAGES = 5;
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function GalleryDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN";

  const { data: images = [], mutate } = useSWR("/api/user/images", fetcher, { refreshInterval: 5000 });
  const [modalOpened, setModalOpened] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  const uploadImages = async () => {
    if (!files.length) return;
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("tags", JSON.stringify(tags.map(t => t.id)));

    const res = await fetch("/api/images/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      notifications.show({ title: "Error", message: data.error || "Upload failed", color: "red", autoClose: 2000 });
      return;
    }

    notifications.show({ title: "Success", message: "Images uploaded", color: "green", autoClose: 2000 });
    setModalOpened(false); setFiles([]); setTags([]); mutate();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/user/images/${id}`, { method: "DELETE" });
    notifications.show({ title: "Deleted", message: "Image deleted", color: "green", autoClose: 2000 });
    mutate();
  };

  return (
    <div style={{ padding: 20 }}>
      <Stack>
        <Text fw={600}>Welcome, {session?.user?.name} ({isAdmin ? "Admin" : "User"})</Text>
        {!isAdmin && <Alert icon={<IconAlertCircle size={16} />} title="Free Upload Limit" color="red">Only {MAX_FREE_IMAGES} images allowed.</Alert>}

        <Group justify="space-between">
          <Title order={3}>Gallery</Title>
          <ActionIcon size="lg" color="blue" variant="filled" onClick={() => setModalOpened(true)}><IconPlus size={20} /></ActionIcon>
        </Group>

        <ScrollArea h={500}>
          <Group gap="md" wrap="wrap">
            {images.map(img => (
              <Card key={img.id} shadow="sm" w={240}>
                <Image src={img.url} height={140} radius="md" fit="cover" />
                <Text size="xs" mt="xs">{new Date(img.createdAt).toLocaleDateString()}</Text>
                <Text size="xs" c="dimmed">Uploaded by: {img.uploadedBy?.name}</Text>

                {img.taggedUsers?.length > 0 && (
                  <Box mt="xs">
                    <Text size="xs" fw={500}>Tagged:</Text>
                    <Group gap="xs" mt={4}>{img.taggedUsers.map(u => <Badge key={u.id} color="blue">{u.name}</Badge>)}</Group>
                  </Box>
                )}

                <Button fullWidth mt="xs" color="red" size="xs" onClick={() => handleDelete(img.id)}>Delete</Button>
              </Card>
            ))}
          </Group>
        </ScrollArea>

       <Modal
  opened={modalOpened}
  onClose={() => setModalOpened(false)}
  title="Upload Images"
  centered
  size="md"
  radius="lg"
  overlayProps={{
    blur: 4,
    backgroundOpacity: 0.55,
  }}
  styles={{
    header: {
      backgroundColor: "#f8f5f2",
      borderBottom: "1px solid #eee",
    },
    title: {
      fontWeight: 600,
      fontSize: "18px",
    },
    body: {
      paddingTop: 20,
      paddingBottom: 25,
    },
  }}
>
  <Stack gap="md">
    <Box
      p="md"
      style={{
        border: "2px dashed #d6ccc2",
        borderRadius: "12px",
        backgroundColor: "#fafafa",
        textAlign: "center",
      }}
    >
      <input
        type="file"
        multiple
        style={{ cursor: "pointer" }}
        onChange={e => setFiles(Array.from(e.target.files || []))}
      />
    </Box>

    <TagInput
      currentUserName={session?.user?.name || ""}
      onTagSelect={t => setTags(prev => [...prev, t])}
    />

    <Button
      fullWidth
      disabled={files.length === 0}
      onClick={uploadImages}
      style={{
        backgroundColor: "#5c4033",
        color: "white",
        fontWeight: 600,
      }}
      radius="md"
    >
      Upload Images
    </Button>

    {!isAdmin && (
      <Button
        fullWidth
        variant="outline"
        color="blue"
        radius="md"
        onClick={() => router.push("/payment")}
      >
        Go to Payment Page
      </Button>
    )}
  </Stack>
</Modal>
      </Stack>
    </div>
  );
}