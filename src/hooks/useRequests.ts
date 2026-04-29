"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type RequestRow = {
  id: string;
  citizenId: string;
  type: string;
  status: string;
  severity: number;
  lat: number;
  lng: number;
  description?: string;
};

export function useRequestsList(feed?: boolean) {
  return useQuery({
    queryKey: ["requests", feed ? "feed" : "list"],
    queryFn: async () => {
      const q = feed ? "?feed=1" : "";
      const res = await fetch(`/api/requests${q}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{
        requests: RequestRow[];
        allocationEvents?: unknown[];
      }>;
    },
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      type: string;
      severity: number;
      description: string;
      lat: number;
      lng: number;
    }) => {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{ id: string; duplicate?: boolean }>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useAllocateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      requestId: string;
      strategy: "greedy" | "severity";
    }) => {
      const res = await fetch("/api/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
