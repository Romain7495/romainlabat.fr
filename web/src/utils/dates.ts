export function fmtMY(ym: string | undefined): string {
  if (!ym || typeof ym !== "string") return "";
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${m.padStart(2, "0")}/${y}`;
}

export function fmtJobRange(
  start: string | undefined,
  end: string | undefined,
  presentWord: string
): string {
  const a = fmtMY(start);
  const b = end ? fmtMY(end) : presentWord;
  return `${a} — ${b}`;
}

export function fmtEduRange(start: string | undefined, end: string | undefined): string {
  const a = fmtMY(start);
  const b = fmtMY(end);
  if (a && b) return `${a} — ${b}`;
  return a || b || "";
}
