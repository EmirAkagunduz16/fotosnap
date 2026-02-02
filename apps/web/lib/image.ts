export const getImageUrl = (imagePath: string | null) => {
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  if (!imagePath) {
    return "";
  }
  const path = imagePath.startsWith("images/")
    ? imagePath
    : `images/${imagePath}`;
  return `${BASE_URL}/uploads/${path}`;
};
