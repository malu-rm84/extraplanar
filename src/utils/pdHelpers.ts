// src/utils/pdHelpers.ts
export const parsePD = (custo: string) => {
  const match = custo.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};