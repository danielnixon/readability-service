// @flow

"use strict";

// TODO: Use real solution like Compact Language Detector 2
// see https://github.com/CLD2Owners/cld2
// see https://dxr.mozilla.org/mozilla-central/source/browser/components/translation/cld2
exports.guessLanguage = function(htmlLangAttr: ?string, contentLanguage: ?string): ?string {
  const lang = htmlLangAttr || contentLanguage;
  return lang ? lang.split("-")[0] : undefined;
}
