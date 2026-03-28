export function priorityScore(severity: number): number {
  return Math.max(0, severity);
}
