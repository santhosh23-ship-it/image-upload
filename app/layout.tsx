import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Providers from "@/app/components/provider";
import type { Metadata, Viewport } from "next";
import ClientProviders from "@/app/provider";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

/* ✅ Metadata must be here only */
export const metadata: Metadata = {
  title: "Image Upload System",
  description: "Upload and manage your images easily",
};

/* ✅ Viewport type safe */
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        {/* ✅ Required for dark/light mode */}
        <ColorSchemeScript />
      </head>

      <body>
        
        <Providers>
          <MantineProvider
            theme={{
              primaryColor: "blue",
              defaultRadius: "md",
            }}
            defaultColorScheme="light"
          >
            {/* ✅ Notifications must be inside MantineProvider */}
            <Notifications position="top-right" />

            {/* ✅ Client side session/theme logic */}
            <ClientProviders />

            {children}
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}