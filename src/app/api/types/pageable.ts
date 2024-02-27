export interface Pageable<T> {
  /**
   * Get current page elements
   */
  content: T[];

  /**
   * Get the total number of elements
   */
  totalElements: number;

  /**
   * Get the total number of pages
   */
  totalPages: number;

  /**
   * Get the page size
   */
  size: number;

  /**
   * Get the index of the current page
   */
  number: number;

  /**
   * Get the number of elements in the current page
   */
  numberOfElements: number;

  /**
   * Check if the current page is the first one
   */
  first: boolean;

  /**
   * Check if the current page is the last one
   */
  last: boolean;
}
