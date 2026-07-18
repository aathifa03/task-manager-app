"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardRedirectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "assigner") {
        router.push("/assigner/dashboard");
      } else if (user.role === "viewer") {
        router.push("/viewer/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  return (
    <ProtectedRoute>
      <LoadingSpinner />
    </ProtectedRoute>
  );
}