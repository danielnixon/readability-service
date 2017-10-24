// @flow

const express = require('express');
const app = express();
const ReadabilityService = require("./ReadabilityService");

app.get('/', function (req: express$Request, res: express$Response) {
  res.setHeader('Content-Type', 'application/json');

  const url = req.query.url;

  if (Array.isArray(url)) {
    res.status(400);
    res.send(JSON.stringify({"message": "Query param `url` must appear only once."}));
  } else if (!url) {
    res.status(400);
    res.send(JSON.stringify({"message": "Missing required query param `url`."}));
  } else {
    ReadabilityService.cleanArticle(url).then( article => {
      res.send(JSON.stringify(article));
    }, error => {
      console.log(error.message);
      res.status(500);
      res.send(JSON.stringify({"message": error.message || "Failed to clean article."}));
    });
  }
});

app.listen(3000, function () {
  console.log('Readability Service listening on port 3000.');
});