"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  clientProfile?: {
    companyName: string | null;
    contactName: string;
  };
  contractorProfile?: {
    companyName: string;
    contactName: string;
  };
  leadBuyerProfile?: {
    companyName: string;
    contactName: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setState({ user: data.user, loading: false });
        } else {
          setState({ user: null, loading: false });
        }
      } catch {
        setState({ user: null, loading: false });
      }
    }

    fetchUser();
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({ user: null, loading: false });
    router.push("/login");
    router.refresh();
  }, [router]);

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: !!state.user,
    logout,
  };
}
