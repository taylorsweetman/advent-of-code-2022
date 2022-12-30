export type Node<T> = {
  value: T;
  weightedConnections: { value: T; weight: number }[];
};
