// src/utils/imageUtils.ts
export const getImagePath = (imageName: string) => {
  const base = import.meta.env.BASE_URL;
  
  // Garante caminho válido para desenvolvimento e produção
  const path = base 
    ? `${base.endsWith('/') ? base : `${base}/`}dices/${imageName}`
    : `/dices/${imageName}`;
  
  return path.replace(/([^:]\/)\/+/g, '$1'); // Remove barras duplas
};