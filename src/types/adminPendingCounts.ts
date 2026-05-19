export type AdminPendingCounts = {
  events: number;
  news: number;
  businesses: number;
  localResources: number;
  total: number;
};

export const EMPTY_ADMIN_PENDING_COUNTS: AdminPendingCounts = {
  events: 0,
  news: 0,
  businesses: 0,
  localResources: 0,
  total: 0,
};
