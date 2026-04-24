import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  const demoPassword = await bcrypt.hash("digitalo123", 10);

  // 1. Create a Category
  const category = await prisma.category.upsert({
    where: { slug: "saas-starter-kits" },
    update: {},
    create: {
      slug: "saas-starter-kits",
      name: "SaaS Starter Kits",
      blurb: "Everything you need to launch your next project in record time.",
    },
  });

  // 2. Create a User (Creator) — demo login: alex@digitalo.app / digitalo123
  const user = await prisma.user.upsert({
    where: { email: "alex@digitalo.app" },
    update: { passwordHash: demoPassword },
    create: {
      email: "alex@digitalo.app",
      name: "Alex Morgan",
      role: "CREATOR",
      passwordHash: demoPassword,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
  });

  // 3. Create a Creator profile
  const creator = await prisma.creator.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      handle: "alexmorgan",
      displayName: "Alex Morgan",
      tagline: "Building digital products for creators.",
      bio: "Software engineer turned creator. I build tools to help you ship faster.",
      avatarUrl: user.image,
      verified: true,
    },
  });

  // 4. Create a Product
  const product = await prisma.product.upsert({
    where: { slug: "saas-starter-kit" },
    update: {},
    create: {
      creatorId: creator.id,
      slug: "saas-starter-kit",
      title: "SaaS Starter Kit",
      tagline: "Launch your SaaS in days, not months.",
      description: "Our SaaS Starter Kit provides a rock-solid foundation for your next big idea. We've handled everything from authentication to database schemas, so you can focus on what makes your product unique.",
      priceCents: 4900,
      status: "PUBLISHED",
      categoryId: category.id,
      bestSeller: true,
      salesCount: 1204,
      ratingAvg: 4.9,
      ratingCount: 124,
    },
  });

  // 5. Create Licenses
  await prisma.license.createMany({
    data: [
      { productId: product.id, name: "Personal", priceCents: 4900, perks: JSON.stringify(["Single Project", "Community Support"]) },
      { productId: product.id, name: "Commercial", priceCents: 9900, perks: JSON.stringify(["Unlimited Projects", "Priority Support"]) },
    ],
  });

  // 6. Create some Customers and Orders
  const customers = [
    { email: "sarah@example.com", name: "Sarah Chen" },
    { email: "james@example.com", name: "James Parker" },
    { email: "jessica@example.com", name: "Jessica Lee" },
  ];

  for (const customerData of customers) {
    const customer = await prisma.user.upsert({
      where: { email: customerData.email },
      update: { passwordHash: demoPassword },
      create: {
        email: customerData.email,
        name: customerData.name,
        role: "BUYER",
        passwordHash: demoPassword,
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id,
        email: customer.email,
        status: "PAID",
        totalCents: 4900,
        subtotalCents: 4900,
        items: {
          create: {
            productId: product.id,
            priceCents: 4900,
            qty: 1,
          },
        },
      },
    });
  }

  // 7. Initialize Creator Metrics
  await prisma.creatorMetrics.upsert({
    where: { creatorId: creator.id },
    update: {
      customers: 3,
      totalSalesCents: 14700,
      productsSold: 3,
    },
    create: {
      creatorId: creator.id,
      customers: 3,
      totalSalesCents: 14700,
      productsSold: 3,
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
