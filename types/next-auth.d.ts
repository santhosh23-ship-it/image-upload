import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "PRODUCT_OWNER" | "ADMIN" | "USER";
      organizationId: string | null;

      isSystemAdmin: boolean;      // ✅ ADD THIS
      imageQuota: number;
      organizationQuota: number;

    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "PRODUCT_OWNER" | "ADMIN" | "USER";
    organizationId: string | null;

    isSystemAdmin: boolean;        // ✅ ADD THIS
    imageQuota: number;
    organizationQuota: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "PRODUCT_OWNER" | "ADMIN" | "USER";
    organizationId: string | null;

    isSystemAdmin: boolean;        // ✅ ADD THIS
    imageQuota: number;
    organizationQuota: number;
  }
}