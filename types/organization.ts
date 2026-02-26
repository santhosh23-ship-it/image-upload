export type Organization = {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  admin?: {
    email: string;
  } | null;
};
