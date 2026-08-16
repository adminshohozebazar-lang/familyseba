"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      Logout
    </Button>
  );
}
