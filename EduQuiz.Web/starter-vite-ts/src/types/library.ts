import type { Visibility } from "./quiz";

export type LibraryFilters = {
  activity: string;
  search: string;
};

export type LibraryItem = {
  id: string;
  activity: string;
  title: string;
  visibility: Visibility;
  createdAt: string;
  totalItems: number;
};
