document.addEventListener("DOMContentLoaded", () => {
  let formEditID = null;
  const ul = document.querySelector("#quote-list");
  const form = document.querySelector("#new-quote-form");
  const sortButton = document.querySelector(".sortButton");
  const fetchData = (url, option = {}) => {
    if (option === {}) {
      return fetch(url).then(res => jes.json());
    } else {
      return fetch(url, option).then(res => res.json());
    }
  };
  const displayLike = span => {
    ++span.innerText;
  };

  const displayLikes = (quote, span) => {
    fetchData("http://localhost:3000/likes").then(likes =>
      likes.forEach(like => {
        if (like.quoteId === quote.id) {
          displayLike(span);
        }
      })
    );
  };

  const createLike = (quote, span) => {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({ quoteId: quote.id, createdAt: Date.now() })
    };
    fetchData("http://localhost:3000/likes", option).then(displayLike(span));
  };

  const deleteQuote = (quote, li) => {
    const option = {
      method: "DELETE"
    };
    fetchData(`http://localhost:3000/quotes/${quote.id}`, option).then(
      li.remove()
    );
  };

  const addQuote = quote => {
    const li = document.createElement("li");
    li.className = "quote-card";
    li.id = `quote-${quote.id}`;
    const blockquote = document.createElement("blockquote");
    blockquote.className = "blockquote";
    const p = document.createElement("p");
    p.className = "mb-0";
    p.innerText = quote.quote;
    const footer = document.createElement("footer");
    footer.className = "blockquote-footer";
    footer.innerText = quote.author;
    const br = document.createElement("br");
    const buttonSuccess = document.createElement("button");
    buttonSuccess.className = "btn-success";
    buttonSuccess.innerText = "Likes: ";
    const span = document.createElement("span");
    span.innerText = 0;
    const buttonDelete = document.createElement("button");
    buttonDelete.className = "btn-danger";
    buttonDelete.innerText = "Delete";
    const buttonEdit = document.createElement("button");
    buttonEdit.className = "btn-info";
    buttonEdit.innerText = "Edit";
    buttonSuccess.append(span);
    blockquote.append(p, footer, br, buttonSuccess, buttonDelete, buttonEdit);
    li.append(blockquote);
    ul.append(li);
    displayLikes(quote, span);
    buttonSuccess.addEventListener("click", () => {
      createLike(quote, span);
    });
    buttonDelete.addEventListener("click", () => {
      deleteQuote(quote, li);
    });
    buttonEdit.addEventListener("click", () => {
      editQuote(quote);
    });
  };

  const editQuote = quote => {
    if (confirm("You are editing this quote")) {
      txt = "You pressed OK!";
      document.querySelector("#new-quote").value = quote.quote;
      document.querySelector("#author").value = quote.author;
      window.location = "#new-quote-form";
      formEditID = quote.id;
    } else {
      txt = "You pressed Cancel!";
    }
  };

  const init = () => {
    ul.innerHTML = "";
    fetchData("http://localhost:3000/quotes").then(quotes =>
      quotes.forEach(quote => addQuote(quote))
    );
  };

  const initSort = () => {
    ul.innerHTML = "";
    fetchData("http://localhost:3000/quotes?_sort=author").then(quotes =>
      quotes.forEach(quote => addQuote(quote))
    );
  };

  init();

  const postQuote = event => {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        quote: event.target.quote.value,
        author: event.target.author.value,
        createdAt: Date.now()
      })
    };
    fetchData("http://localhost:3000/quotes", option).then(quote =>
      addQuote(quote)
    );
  };

  const patchQuote = event => {
    const option = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        quote: event.target.quote.value,
        author: event.target.author.value,
        createdAt: Date.now()
      })
    };
    fetchData(`http://localhost:3000/quotes/${formEditID}`, option).then(
      quote => {
        const quoteCard = document.querySelector(`#quote-${quote.id}`);
        quoteCard.children[0].children[0].innerText = quote.quote;
        quoteCard.children[0].children[1].innerText = quote.author;
      }
    );
    formEditID = null;
  };

  form.addEventListener("submit", () => {
    event.preventDefault();
    if (formEditID) {
      patchQuote(event);
    } else {
      postQuote(event);
    }
    document.querySelector("#new-quote").value = "";
    document.querySelector("#author").value = "";
  });

  sortButton.addEventListener("click", () => {
    if (sortButton.innerText === "Sort by Author") {
      sortButton.innerText = "Unsort Quotes";
      initSort();
    } else {
      sortButton.innerText = "Sort by Author";
      init();
    }
  });
});
