export const generateRandomImageSource = (width: number, height: number) => {
  const seed = Math.random().toString(36).slice(2);
  return `https://picsum.photos/seed/${seed}/${Math.round(width)}/${Math.round(height)}`;
};
