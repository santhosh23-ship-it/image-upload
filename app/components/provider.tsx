"use client";

import React from "react";

export default function ClientProvidersWrapper({ children }: { children?: React.ReactNode }) {
  // Add any client-side providers here
  return <>{children}</>;
}