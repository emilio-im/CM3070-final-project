export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

export const isIdValid = (id: string): boolean => {
  const regex = new RegExp("^[0-9a-fA-F]{24}$");
  return regex.test(id);
};
