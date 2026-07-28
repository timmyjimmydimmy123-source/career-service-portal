import path from "node:path";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.admin.upsert({
    where: { email: "admin@example.edu" },
    update: {},
    create: {
      authUserId: "00000000-0000-0000-0000-000000000000",
      email: "admin@example.edu",
      fullName: "Sample Admin",
      role: "SUPER_ADMIN",
    },
  });

  await prisma.alumni.createMany({
    data: [
      {
        fullName: "Jordan Reyes",
        graduationYear: 2016,
        currentTitle: "Software Engineer",
        currentCompany: "Acme Corp",
        bio: "Studied computer science and now builds backend systems.",
        industry: "Technology",
        createdById: admin.id,
      },
      {
        fullName: "Priya Nair",
        graduationYear: 2012,
        currentTitle: "Registered Nurse",
        currentCompany: "City General Hospital",
        bio: "Went into nursing after volunteering at the school health fair.",
        industry: "Healthcare",
        createdById: admin.id,
      },
    ],
  });

  await prisma.volunteer.createMany({
    data: [
      {
        title: "Weekend Food Bank Volunteer",
        organization: "Community Food Bank",
        description: "Sort and pack donations every Saturday morning.",
        location: "Downtown",
        contactEmail: "volunteer@communityfoodbank.org",
        createdById: admin.id,
      },
    ],
  });

  await prisma.job.createMany({
    data: [
      {
        title: "Retail Associate",
        company: "Local Grocery Co.",
        description: "Entry-level position, evenings and weekends.",
        location: "Main Street",
        jobType: "PART_TIME",
        applyUrl: "https://example.com/apply",
        createdById: admin.id,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
