"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  Button,
  Group,
  Image,
  Text,
  Stack,
  Badge,
  Alert,
  Divider,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconAlertCircle,
  IconCreditCard,
} from "@tabler/icons-react";

import NotificationsComponent from "@/app/notification/Notification";
import TagInput from "@/app/(protected)/user/tagInput";

const MAX_IMAGES = 5;

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login";
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState("");
  const [serverError, setServerError] = useState("");
  const [uploadedImages, setUploadedImages] = useState<{ url: string }[]>([]);
  const [blockedFiles, setBlockedFiles] = useState<string[]>([]);

  // ✅ Name + Role display
  const displayName = session?.user
    ? `${session.user.name} (${session.user.role?.toUpperCase() || "USER"})`
    : "Someone (USER)";

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > MAX_IMAGES) {
      setLimitError(`Maximum ${MAX_IMAGES} images only allowed`);
      return;
    }
    setLimitError("");
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles(acceptedFiles);
    setPreviews(acceptedFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleTagSelect = (user: { id: string; name: string }) => {
    if (!tags.find((t) => t.id === user.id))
      setTags((prev) => [...prev, user]);
  };

  const uploadImages = async () => {
    if (!files.length) return alert("Select images first");

    setLoading(true);
    setServerError("");
    setUploadedImages([]);
    setBlockedFiles([]);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("tags", JSON.stringify(tags.map((t) => t.id)));

    try {
      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Upload failed");
        return;
      }

      setUploadedImages(data.uploadedImages || []);
      setBlockedFiles(data.blockedFiles || []);
      setFiles([]);
      setPreviews([]);
      setTags([]);
      setLimitError("");

      alert("Upload success ✅");
    } catch {
      setServerError("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <Text>Loading...</Text>;

  return (
    <Stack
      align="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#efe3d0",
        paddingTop: 40,
      }}
    >
      {/* 🔔 Real-time Notification Listener */}
      {session?.user?.id && (
        <NotificationsComponent userId={session.user.id} />
      )}

      <Card
        shadow="md"
        radius="lg"
        p="xl"
        w={520}
        sx={{
          backgroundColor: "#e6c9a8",
          border: "1px solid #c19a6b",
        }}
      >
        {/* Welcome message with name + role */}
        <Text fw={600} mb="md" size="lg">
          Welcome, {displayName}!
        </Text>

        <Alert
          icon={<IconAlertCircle size={18} />}
          color="red"
          radius="md"
          mb="md"
        >
          Maximum <b>{MAX_IMAGES}</b> images only allowed
        </Alert>

        {serverError && (
          <Alert color="red" radius="md" mb="md">
            {serverError}
          </Alert>
        )}

        <Dropzone
          onDrop={handleDrop}
          multiple
          accept={["image/png", "image/jpeg", "image/jpg"]}
          styles={{
            root: {
              border: "2px dashed #8b5e3c",
              borderRadius: 14,
              backgroundColor: "#f5e3cf",
            },
          }}
        >
          <Group justify="center" gap="xl" mih={160}>
            <Dropzone.Accept>
              <IconUpload size={50} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} />
            </Dropzone.Idle>

            <Stack align="center" gap={4}>
              <Text fw={600}>Drop your image here, or browse</Text>
              <Text size="sm" c="dimmed">
                JPG, JPEG, PNG (max {MAX_IMAGES})
              </Text>
            </Stack>
          </Group>
        </Dropzone>

        {limitError && (
          <Text c="red" size="sm" mt="xs">
            {limitError}
          </Text>
        )}

        {/* TagInput with display name */}
        <Stack mt="md">
          <TagInput currentUserName={displayName} onTagSelect={handleTagSelect} />

          <Group gap="xs">
            {tags.map((t) => (
              <Badge
                key={t.id}
                sx={{ backgroundColor: "#8b5e3c", color: "white" }}
              >
                {t.name}
              </Badge>
            ))}
          </Group>
        </Stack>

        {previews.length > 0 && (
          <Group mt="md">
            {previews.map((url, i) => (
              <Image
                key={i}
                src={url}
                width={90}
                height={90}
                radius="md"
                alt="preview"
              />
            ))}
          </Group>
        )}

        <Button
          fullWidth
          mt="lg"
          loading={loading}
          disabled={!!limitError || !files.length}
          onClick={uploadImages}
          sx={{
            backgroundColor: "#5a3825",
            color: "white",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#47291a" },
          }}
        >
          Upload
        </Button>

        <Divider my="md" />

        {uploadedImages.length > 0 && (
          <Stack>
            <Text fw={600}>Uploaded Images:</Text>
            <Group spacing="xs">
              {uploadedImages.map((img, i) => (
                <Image
                  key={i}
                  src={img.url}
                  width={90}
                  height={90}
                  radius="md"
                  alt="uploaded"
                />
              ))}
            </Group>
          </Stack>
        )}

        {blockedFiles.length > 0 && (
          <Alert color="yellow" radius="md" mt="md">
            Some files were blocked due to quota: {blockedFiles.join(", ")}
          </Alert>
        )}

        <Button
          fullWidth
          leftSection={<IconCreditCard size={18} />}
          variant="outline"
          sx={{
            borderColor: "#5a3825",
            color: "#5a3825",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#5a3825",
              color: "white",
            },
          }}
          onClick={() => window.location.href = `/payment/${session?.user?.id}`}
        >
          Proceed to Payment
        </Button>
      </Card>
    </Stack>
  );
}