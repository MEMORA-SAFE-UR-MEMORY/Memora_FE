export function generateStarPoints(
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  const step = Math.PI / spikes;
  const points: string[] = [];

  for (let i = 0; i < 2 * spikes; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + Math.cos(i * step - Math.PI / 2) * r;
    const y = cy + Math.sin(i * step - Math.PI / 2) * r;
    points.push(`${x},${y}`);
  }

  return points.join(" ");
}
