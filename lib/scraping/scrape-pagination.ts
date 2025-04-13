import { CheerioAPI } from "cheerio";

export function scrapePagination($page: CheerioAPI) {
  const pagination = $page("nav[aria-label='Pagination']");
  const paginationNumbers = pagination.find(".wp-block-query-pagination-numbers");
  const pageLinks = paginationNumbers.find("a");
  const lastPageNumberString = pageLinks.last().text();
  const lastPageNumber = parseInt(lastPageNumberString) || 1;

  return lastPageNumber;
}