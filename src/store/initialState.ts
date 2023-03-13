export const initialHostState = () => ({
  hostID: Math.random()
    .toString(36)
    .substring(2, 7 + 2),
});

export const initialNotHostState = () => ({
  notHostID: window.location.pathname.slice(1),
});
