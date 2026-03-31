/** YYYY-MM -> MM/YYYY */
export function fmtMY(ym) {
  if (!ym || typeof ym !== "string") return "";
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${m.padStart(2, "0")}/${y}`;
}

export function fmtRange(start, end, presentWord = "present") {
  const a = fmtMY(start);
  const b = end ? fmtMY(end) : presentWord;
  return { start: a, end: b };
}
