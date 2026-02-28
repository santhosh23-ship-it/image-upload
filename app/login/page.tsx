"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Box,
  Flex,
  Text,
} from "@mantine/core";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.log(result?.error)
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // ✅ Get session
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      const role = session?.user?.role;

      // ✅ Role-based redirect (NEW FLOW)
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        // PRODUCT_OWNER or PRODUCT_USER
        router.push("/organization");
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Flex
      h="100vh"
      justify="center"
      align="center"
      style={{
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
      }}
    >
      <Box
        w={380}
        p="40px"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(15px)",
          borderRadius: "12px",
        }}
      >
        <Title order={2} mb="lg">
          Login
        </Title>

        <TextInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb="md"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="sm"
        />

        {error && (
          <Text c="red" size="sm" mb="sm">
            {error}
          </Text>
        )}

        <Button fullWidth loading={loading} onClick={handleLogin} mt="md">
          Login now
        </Button>
      </Box>
    </Flex>
  );
}