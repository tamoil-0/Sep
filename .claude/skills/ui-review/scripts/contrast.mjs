// Ratio de contraste WCAG entre dos colores hex. Uso: node contrast.mjs "#ffffff" "#0b3a6f"
const lum = (hex) => {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
if (process.argv[2]) {
  const r = ratio(process.argv[2], process.argv[3]);
  console.log(`${process.argv[2]} / ${process.argv[3]}: ${r.toFixed(2)}:1 ${r >= 4.5 ? "AA" : r >= 3 ? "AA-large" : "FAIL"}`);
}
