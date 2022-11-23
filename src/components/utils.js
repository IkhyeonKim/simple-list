export const isArrayItemExists = (list) => {
  if (!Array.isArray(list)) return false;
  if (list.length < 1) return false;
  return true;
};
