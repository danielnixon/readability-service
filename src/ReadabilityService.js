// @flow

"use strict";

import { JSDOM } from "jsdom";
import Readability from "./readability/Readability";
import { estimateReadingTime } from "./ReadingTimeEstimator";
import type { EstimatedReadingTime } from "./ReadingTimeEstimator";
import { guessLanguage } from "./LanguageGuesser";
import request from "request-promise-native";

// TODO
type ReadabilityArticle = any;

type CleanArticleResult = {|
  url: string,
  lang: ?string,
  readingTime: EstimatedReadingTime,
  title: string,
  byline: string,
  excerpt: string,
  length: number,
  dir: ?string,
  content: string,
  textContent: string
|};

function parse(dom): ?ReadabilityArticle {

  // https://github.com/mozilla/readability#usage
  const document = dom.window.document;
  const loc = dom.window.document.location;
  const uri = {
    spec: loc.href,
    host: loc.host,
    prePath: loc.protocol + "//" + loc.host,
    scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
    pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
  };

  // HACK...
  const withGlobalNode = function(func) {
    global.Node = dom.window.Node;
    const result = func();
    delete global.Node;
    return result;
  };

  return withGlobalNode(() => {
    return new Readability(uri, document).parse();
  });
}

function requestArticle(url: string): Promise<any> {
  const requestOptions = {
    resolveWithFullResponse: true,
    encoding: null,
    gzip: true
  };

  return request(url, requestOptions);
}

function cleanArticle(res: any): ?CleanArticleResult {
  // If the request followed any redirects, we want the final URL.
  const finalUrl = res.request.uri.href;

  const options = {
    url: finalUrl,
    contentType: res.headers["content-type"],
    referrer: res.request.getHeader("referer")
  };

  const dom = new JSDOM(res.body, options);
  const article = parse(dom);

  if (article) {
    const htmlLangAttr = dom.window.document.querySelector("html").getAttribute("lang");
    const contentLanguageHeader = res.headers["content-language"];
    const lang = guessLanguage(htmlLangAttr, contentLanguageHeader);

    // Even if we couldn't guess the article language, estimate reading time based on English.
    const readingTime = estimateReadingTime(lang || "en", article.length);

    return {
      url: finalUrl,
      lang: lang,
      readingTime: readingTime,
      title: article.title,
      byline: article.byline,
      excerpt: article.excerpt,
      length: article.length,
      dir: article.dir,
      content: article.content,
      textContent: article.textContent.trim()
    };
  } else {
    return null;
  }
}

exports.cleanArticle = function(url: string): Promise<?CleanArticleResult> {
  return requestArticle(url).then(res => cleanArticle(res));
}
