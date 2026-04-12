import type { RequestType } from "@/types/request.types";

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isRequestType(v: unknown): v is RequestType {
  return v === "medical" || v === "shelter" || v === "food";
}
