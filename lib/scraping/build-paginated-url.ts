const WHITE_HOUSE_NEWS_URL = "https://www.whitehouse.gov/news";

export function buildPaginatedUrl(pageNumber: number) {
    return `${WHITE_HOUSE_NEWS_URL}/page/${pageNumber}/`;
}