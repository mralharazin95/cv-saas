"use client";

import { use } from "react";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Next 16: params is a Promise even in client components — unwrap with use().
  const { locale } = use(params);
  void locale; // locale is also read via useParams() inside DashboardHome

  return <DashboardHome />;
}
