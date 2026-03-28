"use client";

import type { ReactNode } from "react";

type RoleGuardProps = {
  role: string;
  children: ReactNode;
};

export function RoleGuard({ children }: RoleGuardProps) {
  return <>{children}</>;
}
