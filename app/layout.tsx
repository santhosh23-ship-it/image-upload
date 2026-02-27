import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Providers from "@/app/components/provider";
import type { Metadata, Viewport } from "next";
import ClientProviders from "@/app/provider";
import GlobalNotifications from "@/app/notification/GlobalNotifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export const metadata: Metadata = {
  title: "Image Upload System",
  description: "Upload and manage your images easily",
};

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
            <Notifications position="top-right" />
            <ClientProviders />
            <GlobalNotifications />

            {children}
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}