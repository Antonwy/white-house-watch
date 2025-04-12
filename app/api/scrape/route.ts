import { NextRequest, NextResponse } from "next/server";
import {load} from "cheerio";

const WHITE_HOUSE_NEWS_URL = "https://www.whitehouse.gov/news";

const buildPaginatedUrl = (pageNumber: number) => {
    return `${WHITE_HOUSE_NEWS_URL}/page/${pageNumber}/`;
}

type Article = {
    title: string;
    link: string;
}

export async function POST(request: NextRequest) {
    const html = await fetch(buildPaginatedUrl(1)).then(res => res.text());

    const $ = load(html);

    const pagination = $("nav[aria-label='Pagination']");
    const paginationNumbers = pagination.find(".wp-block-query-pagination-numbers");
    const pageLinks = paginationNumbers.find("a");
    const lastPageNumberString = pageLinks.last().text();
    const lastPageNumber = parseInt(lastPageNumberString);

    const articles: Article[]  = [];

    for (let pageNumber = 1; pageNumber <= lastPageNumber; pageNumber++) {
        const html = await fetch(buildPaginatedUrl(pageNumber)).then(res => res.text());
        const $ = load(html);

        const main = $("main");
        const ul = main.find("ul").eq(2);
        const liTags = ul.find("li");

        const newArticles: Article[] = liTags.map((index, element) => {
            const $element = $(element);
            const linkElement = $element.find("a");
            const title = linkElement.text();
            const link = linkElement.attr("href");

            if (!link) {
                return null;
            }

            return { title, link };
        }).filter(Boolean).get();

        articles.push(...newArticles);
    } 

    return NextResponse.json({ lastPageNumber, articles, articlesCount: articles.length });
}