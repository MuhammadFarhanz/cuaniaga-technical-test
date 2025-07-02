"use client";

import { LoginForm } from "./components/login-form";
import Dashboard from "./components/dashboard";
import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <LoaderIcon className="animate-spin w-20 h-20 fixed top-[50%] left-[50%]" />
    );
  }

  return isAuthenticated ? (
    <Dashboard user={user} onLogout={logout} />
  ) : (
    <LoginForm />
  );
}
