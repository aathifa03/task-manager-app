"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: ("assigner" | "viewer")[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (roles && !roles.includes(user.role)) {
        if (user.role === "assigner") {
          router.push("/assigner/dashboard");
        } else if (user.role === "viewer") {
          router.push("/viewer/dashboard");
        } else {
          router.push("/");
        }
      }
    }
  }, [user, isLoading, roles, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || (roles && !roles.includes(user.role))) {
    return <LoadingSpinner />; // Return spinner while redirecting to avoid page flashing
  }

  return <>{children}</>;
}
