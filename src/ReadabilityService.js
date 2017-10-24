// @flow

const { JSDOM } = require("jsdom");
const Readability = require("./readability/Readability");

function parse(dom) {

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

exports.cleanArticle = function(articleURL: string) {
    return JSDOM.fromURL(articleURL).then(dom => parse(dom));
}