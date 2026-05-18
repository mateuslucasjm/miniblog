export const parseTags = (tagsString) => {
  if (!tagsString || typeof tagsString !== "string") return [];

  return tagsString
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
};

export const formatTags = (tagsArray) => {
  if (!tagsArray?.length) return "";
  return tagsArray.join(", ");
};
