# readability-service
[Mozilla's fork of Readability](https://github.com/mozilla/readability) wrapped in a RESTful service.

## Usage

```
git clone https://github.com/danielnixon/readability-service.git
cd readability-service
yarn run init # install dependencies
yarn run build # run babel and flow
yarn run start # now listening on port 3000
curl http://localhost:3000/?url=https://www.theguardian.com/commentisfree/2015/jun/13/european-games-azerbaijan-athletes-not-role-models
```

## Docker Usage

```
docker run -it -p 3000:3000 danielnixon/readability-service
```

## Example output

```json
{

    "url": "https://www.theguardian.com/commentisfree/2015/jun/13/european-games-azerbaijan-athletes-not-role-models",
    "lang": "en",
    "readingTime": {
        "lang": "en",
        "minutesSlow": 8,
        "minutesFast": 6
    },
    "title": "Baku reminds us our top athletes are overgrown infants | Nick Cohen | Opinion",
    "byline": "Nick Cohen",
    "excerpt": "The sports stars heading to the European Games in Azerbaijan have no comments on the dire politics of the host country",
    "length": 6411,
    "dir": null,
    "content": "<div id=\"readability-page-1\" class=\"page\"><p>The pretence that sportsmen and women are “role models” is impossible to maintain. It’s not just that no parent tells their teenage children to model their sex lives on premier league footballers ...</p>...</div>",
    "textContent": "The pretence that sportsmen and women are “role models” is impossible to maintain. It’s not just that no parent tells their teenage children to model their sex lives on premier league footballers ..."
}
```