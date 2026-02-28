// app/layout.tsx
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Providers from "@/app/components/provider"; // SessionProvider
import ClientProvidersWrapper from "@/app/provider"; // client providers
import GlobalNotifications from "@/app/notification/GlobalNotifications";

import type { Metadata, Viewport } from "next";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        {/* ✅ Wrap everything that uses `useSession` */}
        <Providers>
          <MantineProvider
            theme={{
              primaryColor: "blue",
              defaultRadius: "md",
            }}
            defaultColorScheme="light"
          >
            <Notifications position="top-right" />

            {/* Client-side providers */}
            <ClientProvidersWrapper>
              {/* GlobalNotifications now safely inside SessionProvider */}
              <GlobalNotifications />

              {/* Page content */}
              {children}
            </ClientProvidersWrapper>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}