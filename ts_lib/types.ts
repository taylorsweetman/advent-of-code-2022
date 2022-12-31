export type Node<T, U> = {
  id: T;
  value: U;
  weightedConnections: { id: T; weight: number }[];
};
