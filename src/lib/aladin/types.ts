export interface AladinItem {
  itemId: number;
  title: string;
  link: string;
  author: string;
  pubDate: string;
  description: string;
  isbn13: string;
  cover: string;
  categoryName: string;
  publisher: string;
  subInfo?: {
    itemPage?: number;
    [key: string]: unknown;
  };
}

export interface AladinSearchResponse {
  version: string;
  title: string;
  link: string;
  pubDate: string;
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  query: string;
  searchCategoryId: number;
  searchCategoryName: string;
  item: AladinItem[];
}
