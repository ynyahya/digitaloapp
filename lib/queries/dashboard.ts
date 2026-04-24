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

export async function getAnalyticsSummary(creatorId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const previousSince = new Date();
  previousSince.setDate(previousSince.getDate() - days * 2);

  const orders = await db.order.findMany({
    where: {
      createdAt: { gte: previousSince },
      items: {
        some: { product: { creatorId } },
      },
    },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const current = orders.filter((o) => o.createdAt >= since);
  const previous = orders.filter((o) => o.createdAt < since);

  const sumCents = (list: typeof orders) =>
    list.reduce((s, o) => s + o.totalCents, 0);

  const revenueCents = sumCents(current);
  const previousRevenueCents = sumCents(previous);
  const orderCount = current.length;
  const previousOrderCount = previous.length;
  const aov = orderCount > 0 ? revenueCents / orderCount : 0;
  const previousAov =
    previousOrderCount > 0 ? previousRevenueCents / previousOrderCount : 0;

  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (days - 1 - i));
    return { date: d, revenueCents: 0, orders: 0 };
  });
  for (const o of current) {
    const day = new Date(o.createdAt);
    day.setHours(0, 0, 0, 0);
    const idx = buckets.findIndex(
      (b) => b.date.getTime() === day.getTime(),
    );
    if (idx >= 0) {
      buckets[idx].revenueCents += o.totalCents;
      buckets[idx].orders += 1;
    }
  }

  const productMap = new Map<string, { title: string; sales: number; revCents: number }>();
  for (const o of current) {
    for (const item of o.items) {
      const existing = productMap.get(item.product.id) ?? {
        title: item.product.title,
        sales: 0,
        revCents: 0,
      };
      productMap.set(item.product.id, {
        title: existing.title,
        sales: existing.sales + item.qty,
        revCents: existing.revCents + item.priceCents * item.qty,
      });
    }
  }

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revCents - a.revCents)
    .slice(0, 5)
    .map((p) => ({
      title: p.title,
      sales: `${p.sales} ${p.sales === 1 ? "sale" : "sales"}`,
      rev: `$${(p.revCents / 100).toLocaleString()}`,
    }));

  const uniqueCustomers = new Set(current.map((o) => o.userId)).size;
  const previousUniqueCustomers = new Set(previous.map((o) => o.userId)).size;

  return {
    revenue: `$${(revenueCents / 100).toLocaleString()}`,
    revenueDelta: percentDelta(revenueCents, previousRevenueCents),
    orders: orderCount.toLocaleString(),
    ordersDelta: percentDelta(orderCount, previousOrderCount),
    uniqueCustomers: uniqueCustomers.toLocaleString(),
    uniqueCustomersDelta: percentDelta(uniqueCustomers, previousUniqueCustomers),
    aov: `$${(aov / 100).toFixed(2)}`,
    aovDelta: percentDelta(aov, previousAov),
    series: buckets.map((b) => ({
      date: b.date.toISOString().slice(0, 10),
      revenueCents: b.revenueCents,
    })),
    previousSeries: bucketSeries(previous, days, previousSince),
    topProducts,
  };
}

function bucketSeries(
  orders: Array<{ createdAt: Date; totalCents: number }>,
  days: number,
  start: Date,
) {
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return { date: d, revenueCents: 0 };
  });
  for (const o of orders) {
    const day = new Date(o.createdAt);
    day.setHours(0, 0, 0, 0);
    const idx = buckets.findIndex((b) => b.date.getTime() === day.getTime());
    if (idx >= 0) buckets[idx].revenueCents += o.totalCents;
  }
  return buckets.map((b) => ({
    date: b.date.toISOString().slice(0, 10),
    revenueCents: b.revenueCents,
  }));
}

function percentDelta(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return "+0.0%";
    return "+100%";
  }
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export async function getRevenueSeries(creatorId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const orders = await db.order.findMany({
    where: {
      createdAt: { gte: since },
      items: { some: { product: { creatorId } } },
    },
    select: { createdAt: true, totalCents: true },
    orderBy: { createdAt: "asc" },
  });

  return bucketSeries(orders, days, since);
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
