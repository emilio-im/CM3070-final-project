export const getCaretCoordinates = () => {
  let x = 0,
    y = 0;
  const selection = window.getSelection();
  if (selection?.rangeCount !== 0) {
    const range = selection?.getRangeAt(0).cloneRange();
    range?.collapse(false);
    const rect = range?.getClientRects()[0];
    if (rect) {
      x = rect.left;
      y = rect.top;
    }
  }
  return { x, y };
};

export const getHomeRedirection = () => ({
  redirect: {
    permanent: false,
    destination: "/",
  },
});
