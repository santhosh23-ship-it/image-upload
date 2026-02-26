import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  // 1️⃣ Create Organization
  const org = await prisma.organization.create({
    data: { name: "Test Organization", imageQuota: 100 },
  });

  // 2️⃣ Hash passwords
  const adminHashed = await bcrypt.hash("admin123", 10);
  const poHashed = await bcrypt.hash("product123", 10);

  // 3️⃣ Create Admin
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminHashed,
      role: "ADMIN",
      organizationId: org.id,
      isSystemAdmin: true,
      hidden: false,
    },
  });

  // 4️⃣ Create Product Owner (hidden)
  await prisma.user.create({
    data: {
      name: "Product Owner",
      email: "sandy@gmail.com",
      password: poHashed,
      role: "PRODUCT_OWNER",
      organizationId: org.id,
      isSystemAdmin: false,
      hidden: true, // ✅ hidden from admin table
    },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());