import prisma from "@/lib/db/prisma";
import logger from "@/lib/logger";

async function main() {
  /* const adminPassword = await generateHash("admin123");
  const userPassword = await generateHash("kiko");
  const slug = generatePublicSlug();

  // Criar admin
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  }); */

  const period = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12
  ];

  const students = await prisma.student.findMany({
    where: { userId: "cmkvzmi0f000004kytt3e7erh" },
  });

  const newUserId = "cmkx4d93c000104jmeb0ph14q";

  const newStudents = students.map((student) => {
    const { id, ...rest } = student;
    return {
      ...rest,
      userId: newUserId,
      monthlyPeriods: period
    };
  });

  await prisma.student.createMany({
    data: newStudents,
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
