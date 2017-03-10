const url = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

const fetch = require('node-fetch');
const co = require('co');
const cors = require('cors');

function* createQuoteFetcher() {
    const response = yield fetch(url, cors());
    const quote = yield response.json();
    return `${quote.quoteText} - by - ${quote.quoteAuthor}`
}

const quoteFetcher =co(createQuoteFetcher);
quoteFetcher.then(quote => {
    console.log(quote);
});
