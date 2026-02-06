import { generateHash } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import logger from "@/lib/logger";

async function main() {
  const adminPassword = await generateHash("admin123");
  // Criar admin
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  logger.info("Seed completed successfully!", "SEED");
}

main()
  .catch((e) => {
    logger.error("Error seeding the database: ", "SEED", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
