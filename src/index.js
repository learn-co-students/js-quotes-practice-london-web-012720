 
const QUOTES_URL = "http://localhost:3000/quotes";
const QUOTES_WITH_LIKES_URL = QUOTES_URL + "?_embed=likes";
const LIKES_URL = "http://localhost:3000/likes";

const getQuotes = () => fetch(QUOTES_WITH_LIKES_URL).then(res => res.json());
const getQuote = quoteId =>
  fetch(`${QUOTES_URL}/${quoteId}?_embed=likes`).then(res => res.json());
const postLike = quote =>
  fetch(LIKES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ quoteId: quote.id })
  }).then(res => res.json());
const postQuote = quote =>
  fetch(QUOTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(quote)
  }).then(res => res.json());
const updateQuote = quote =>
  fetch(`${QUOTES_URL}/${quote.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(quote)
  }).then(res => res.json());
const deleteQuote = quote =>
  fetch(`${QUOTES_URL}/${quote.id}`, {
    method: "DELETE"
  });

const quotesList = document.querySelector("#quote-list");
const form = document.querySelector("form");

const renderQuotes = quotes => {
  quotes.forEach(quote => {
    renderQuote(quote);
  });
};

const renderQuote = quote => {
  //     <li class='quote-card'>
  //     <blockquote class="blockquote">
  //       <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  //       <footer class="blockquote-footer">Someone famous</footer>
  //       <br>
  //       <button class='btn-success'>Likes: <span>0</span></button>
  //       <button class='btn-danger'>Delete</button>
  //     </blockquote>
  //   </li>
  console.log(quote);
  const li = document.createElement("li");
  li.className = "quote-card";

  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";

  const p = document.createElement("p");
  p.className = "mb-0";
  p.innerText = quote.quote;

  const footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  footer.innerText = quote.author;

  const likeButton = document.createElement("button");
  likeButton.className = "btn-success";
  likeButton.innerText = "Like: ";

  const likespan = document.createElement("span");
  likespan.innerText = quote.likes.length;

  likeButton.addEventListener("click", () => {
    likeQuote(quote, likespan);
  });

  likeButton.append(likespan);

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn-danger";
  deleteButton.innerText = "Delete";

  deleteButton.addEventListener("click", () => {
    deleteQuote(quote).then(() => li.remove());
  });

  const editButton = document.createElement("button");
  editButton.className = "btn-info";
  editButton.innerText = "edit";

  editButton.addEventListener("click", () => {
    if (editButton.innerText === "edit") {
      editButton.innerText = "save";
      p.contentEditable = true;
      footer.contentEditable = true;
    } else {
      const updatedQuote = {
        ...quote,
        quote: p.innerText,
        author: footer.innerText
      };
      updateQuote(updatedQuote);
      editButton.innerText = "edit";
      p.contentEditable = false;
      footer.contentEditable = false;
    }
  });

  li.append(blockquote, p, footer, editButton, likeButton, deleteButton);

  quotesList.append(li);
};

const likeQuote = (quote, likeSpan) => {
  postLike(quote).then(like => {
    quote.likes.push(like);
    likeSpan.innerText = quote.likes.length;
  });
};

form.addEventListener("submit", event => {
  event.preventDefault();
  const newQuote = {
    quote: event.target.elements.quote.value,
    author: event.target.author.value
  };
  postQuote(newQuote)
    .then(quote => getQuote(quote.id))
    .then(quoteWithLikes => renderQuote(quoteWithLikes));

  //   postQuote(newQuote).then(quoteNoLikes => {
  //     const quoteWithLikes = {
  //       ...quoteNoLikes,
  //       likes: []
  //     };
  //     renderQuote(quoteWithLikes);
  //   });
});

getQuotes().then(quotes => renderQuotes(quotes));
 