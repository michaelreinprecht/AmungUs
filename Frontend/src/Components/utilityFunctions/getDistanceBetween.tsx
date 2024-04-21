export default function getDistanceBetween(
  xPos1: number,
  yPos1: number,
  xPos2: number,
  yPos2: number
) {
  const xDistance = xPos1 - xPos2;
  const yDistance = yPos1 - yPos2;
  const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2);
  return distance;
}
