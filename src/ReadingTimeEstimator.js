/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Based on Mozilla's `ReaderMode.jsm`.
 * See https://dxr.mozilla.org/mozilla-central/source/toolkit/components/reader/ReaderMode.jsm
 * See https://github.com/mozilla/gecko-dev/blob/ec985117e6b417df97e45ba91413013d5d484370/toolkit/components/reader/ReaderMode.jsm
 */

// @flow

"use strict";

type ReadingSpeed = {| cpm: number, variance: number |};

export type EstimatedReadingTime = {| lang: string, minutesSlow: number, minutesFast: number |};

/**
 * Estimates reading time range for an article.
 *
 * @param lang the language of the article.
 * @param length the length in characters of the article.
 */
exports.estimateReadingTime = function(lang: string, length: number): EstimatedReadingTime {

  const readingSpeedForArticleLang = readingSpeedForLanguage(lang);
  const readingSpeed = readingSpeedForArticleLang || readingSpeedForEnglish;

  const charactersPerMinuteLow = readingSpeed.cpm - readingSpeed.variance;
  const charactersPerMinuteHigh = readingSpeed.cpm + readingSpeed.variance;

  return {
    lang: readingSpeedForArticleLang ? lang : "en",
    minutesSlow: Math.ceil(length / charactersPerMinuteLow),
    minutesFast: Math.ceil(length / charactersPerMinuteHigh)
  };

}

const readingSpeedForEnglish: ReadingSpeed = {cpm: 987,  variance: 118 };

/**
 * Returns the reading speed of a selection of languages with likely variance.
 *
 * Reading speed estimated from a study done on reading speeds in various languages.
 * study can be found here: http://iovs.arvojournals.org/article.aspx?articleid=2166061
 *
 * @return object with characters per minute and variance.
 * Undefined if no suitable language is found in the collection.
 */
function readingSpeedForLanguage(lang: string): ?ReadingSpeed {
  const readingSpeed = new Map([
    [ "en", readingSpeedForEnglish ],
    [ "ar", {cpm: 612,  variance: 88 } ],
    [ "de", {cpm: 920,  variance: 86 } ],
    [ "es", {cpm: 1025, variance: 127 } ],
    [ "fi", {cpm: 1078, variance: 121 } ],
    [ "fr", {cpm: 998,  variance: 126 } ],
    [ "he", {cpm: 833,  variance: 130 } ],
    [ "it", {cpm: 950,  variance: 140 } ],
    [ "jw", {cpm: 357,  variance: 56 } ],
    [ "nl", {cpm: 978,  variance: 143 } ],
    [ "pl", {cpm: 916,  variance: 126 } ],
    [ "pt", {cpm: 913,  variance: 145 } ],
    [ "ru", {cpm: 986,  variance: 175 } ],
    [ "sk", {cpm: 885,  variance: 145 } ],
    [ "sv", {cpm: 917,  variance: 156 } ],
    [ "tr", {cpm: 1054, variance: 156 } ],
    [ "zh", {cpm: 255,  variance: 29 } ],
  ]);

  return readingSpeed.get(lang);
}