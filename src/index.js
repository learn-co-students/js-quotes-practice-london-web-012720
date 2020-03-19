const quotesAPI = "http://localhost:3000/quotes?_embed=likes";
const postQuotesAPI = "http://localhost:3000/quotes";
const likesAPI = "http://localhost:3000/likes";
const quoteLi = document.querySelector("#quote-list");

const init = () => {
  fetch(quotesAPI)
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes));
};

const renderQuotes = quotes => {
  quotes.forEach(quote => {
    renderQuote(quote);
  });
};

const renderQuote = quote => {
  const quoteCard = document.createElement("li");
  const blockQuote = document.createElement("blockquote");
  const quoteContent = document.createElement("p");
  const quoteAuthor = document.createElement("footer");
  const deleteButton = document.createElement("button");
  const likeButton = document.createElement("button");
  const likeSpan = document.createElement("span");

  quoteCard.className = "quote-card";
  blockQuote.className = "blockquote";
  quoteContent.className = "mb-0";
  quoteContent.innerText = quote.quote;
  quoteAuthor.className = "blockquote-footer";
  quoteAuthor.innerText = quote.author;

  likeButton.className = "btn-sucess";
  likeButton.innerText = "Like";

  likeSpan.innerText = quote.likes.length;

  likeButton.addEventListener("click", () => {
    likeQuote(quote, likeSpan);
  });

  likeButton.append(likeSpan);
// see like section at bottom 


  deleteButton.className = "btn-success";
  deleteButton.innerText = "Delete";

  //   Delete Quote
  deleteButton.addEventListener("click", () => {
    fetch(`${postQuotesAPI}/${quote.id}`, {
      method: "DELETE"
    }).then(() => quoteCard.remove());
  });

  blockQuote.append(quoteContent, quoteAuthor, likeButton, deleteButton);
  quoteCard.append(blockQuote);
  quoteLi.append(quoteCard);
};

// create and submit post
const postQuote = quote =>
  fetch(quotesAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(quote)
  }).then(res => res.json());

const newQuoteForm = document.querySelector("#new-quote-form");

newQuoteForm.addEventListener("submit", event => {
  event.preventDefault();
  const newQuote = {
    quote: event.target.elements.quote.value,
    author: event.target.elements.author.value
  };
  postQuote(newQuote).then(quote => renderQuote(quote));
});

// LIKE QUOTES
const postLike = quote =>
  fetch(likesAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ quoteId: quote.id })
  }).then(res => res.json());

const likeQuote = (quote, likeSpan) => {
  postLike(quote).then(like => {
    quote.likes.push(like);
    likeSpan.innerText = quote.likes.length;
  });
};

init();
