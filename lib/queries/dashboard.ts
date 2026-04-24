import { db } from "@/lib/db";

export async function getDashboardStats(creatorId: string) {
  const metrics = await db.creatorMetrics.findUnique({
    where: { creatorId },
  });

  if (!metrics) {
    return {
      revenue: "$0.00",
      productsSold: 0,
      activeCustomers: 0,
      conversionRate: "0%",
      revenueDelta: "+0%",
      salesDelta: "+0%",
      customersDelta: "+0%",
      conversionDelta: "+0%",
    };
  }

  return {
    revenue: `$${(metrics.totalSalesCents / 100).toLocaleString()}`,
    productsSold: metrics.productsSold,
    activeCustomers: metrics.customers,
    conversionRate: "3.2%", // Mock for now until we have views/conversion tracking
    revenueDelta: "+12.5%",
    salesDelta: "+18.2%",
    customersDelta: "+4.3%",
    conversionDelta: "+0.8%",
  };
}

export async function getRecentSales(creatorId: string, limit = 5) {
  const orders = await db.order.findMany({
    where: {
      items: {
        some: {
          product: {
            creatorId: creatorId,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return orders.map((o) => ({
    name: o.items[0]?.product.title ?? "Unknown Product",
    buyer: o.user.name ?? o.email,
    price: `$${(o.totalCents / 100).toLocaleString()}`,
    time: formatTimeAgo(o.createdAt),
  }));
}

export async function getOrders(creatorId: string) {
  const orders = await db.order.findMany({
    where: {
      items: {
        some: {
          product: {
            creatorId: creatorId,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((o) => ({
    id: o.id.substring(0, 8).toUpperCase(),
    customer: o.user.name ?? o.email,
    product: o.items[0]?.product.title ?? "Unknown Product",
    date: formatTimeAgo(o.createdAt),
    amount: `$${(o.totalCents / 100).toLocaleString()}`,
    status: o.status,
  }));
}

export async function getProducts(creatorId: string) {
  const products = await db.product.findMany({
    where: { creatorId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    price: `$${(p.priceCents / 100).toLocaleString()}`,
    sales: p.salesCount,
    category: p.category?.name ?? "Uncategorized",
    createdAt: formatTimeAgo(p.createdAt),
  }));
}

export async function getCustomers(creatorId: string) {
  const customers = await db.user.findMany({
    where: {
      orders: {
        some: {
          items: {
            some: {
              product: {
                creatorId: creatorId,
              },
            },
          },
        },
      },
    },
    include: {
      orders: {
        where: {
          items: {
            some: {
              product: {
                creatorId: creatorId,
              },
            },
          },
        },
        include: {
          items: true,
        },
      },
    },
  });

  return customers.map((c) => {
    const totalSpentCents = c.orders.reduce((sum, o) => sum + o.totalCents, 0);
    const lastOrder = c.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    return {
      id: c.id,
      name: c.name ?? c.email,
      email: c.email,
      avatar: c.image,
      totalOrders: c.orders.length,
      totalSpent: `$${(totalSpentCents / 100).toLocaleString()}`,
      lastOrder: lastOrder ? formatTimeAgo(lastOrder.createdAt) : "Never",
      status: "ACTIVE", // Can be dynamic based on frequency
    };
  });
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
