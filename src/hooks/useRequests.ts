"use client";

export function useRequests() {
  return { requests: [], loading: false };
}

export function useRequestsList(param?: boolean) {
  return { data: { requests: [] }, isLoading: false, error: null as any, refetch: () => {} };
}

export function useAllocateRequest() {
  return {
    mutateAsync: async ({ requestId, strategy }: { requestId: string; strategy: string }) => {
      console.log("Allocating", requestId, strategy);
    },
    isPending: false,
  };
}
